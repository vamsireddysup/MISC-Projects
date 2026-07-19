/* Oregon DMV Practice — app engine (v2: audio, spaced repetition, stats, browse) */
(() => {
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const LS_KEY = "ordmv";

/* ---------- persistent state ---------- */
const store = (() => {
  let data;
  try { data = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { data = {}; }
  data.missed ||= [];        // question indices answered wrong
  data.mastered ||= [];      // question indices answered right at least once
  data.best ||= null;        // best exam score
  data.theme ||= null;
  data.qstats ||= {};        // per-question {seen, wrong, streak}
  data.exams ||= [];         // exam history [{s,t,d}]
  data.streak ||= { last: null, count: 0 };
  data.audio ||= false;      // read-aloud enabled
  const save = () => localStorage.setItem(LS_KEY, JSON.stringify(data));
  return { data, save };
})();

const qid = q => QUESTIONS.indexOf(q);

/* ---------- theme ---------- */
function applyTheme() {
  const pref = store.data.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = pref;
}
$("#themeToggle").addEventListener("click", () => {
  store.data.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  store.save();
  applyTheme();
});
applyTheme();

/* ---------- speech (read-aloud, like the DMV audio assist) ---------- */
const speech = {
  supported: "speechSynthesis" in window,
  stop() { if (this.supported) speechSynthesis.cancel(); },
  say(text) {
    if (!this.supported || !store.data.audio) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }
};
function questionSpeech(q) {
  let t = q.q;
  if (q.t === "tf") t += " True, or false?";
  else if (q.t === "yn") t += " Yes, or no?";
  else if (q.t !== "fib") {
    const opts = q.o || [];
    t += " " + opts.map((o, i) => `Option ${String.fromCharCode(65 + i)}: ${o}.`).join(" ");
  }
  return t;
}
function syncAudioButtons() {
  $$(".audioToggle").forEach(b => {
    b.classList.toggle("on", store.data.audio);
    b.title = store.data.audio ? "Read-aloud is ON" : "Read-aloud is OFF";
  });
}
function toggleAudio() {
  store.data.audio = !store.data.audio;
  store.save();
  syncAudioButtons();
  if (!store.data.audio) speech.stop();
  else if (quiz) speech.say(questionSpeech(quiz.questions[quiz.i]));
}
$$(".audioToggle").forEach(b => b.addEventListener("click", toggleAudio));

/* ---------- routing ---------- */
function show(view) {
  speech.stop();
  if (quiz && view !== "quiz") {          // navigating away abandons the quiz —
    if (quiz.timerId) clearInterval(quiz.timerId);  // otherwise a timed exam keeps
    quiz = null;                          // ticking and later hijacks the screen
  }
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + view).classList.add("active");
  $$("header nav button").forEach(b => b.classList.toggle("active", b.dataset.nav === view));
  window.scrollTo({ top: 0 });
  if (view === "home") renderHome();
  if (view === "flash") startFlashcards(flashCat);
  if (view === "signs") renderSignGallery();
  if (view === "stats") renderStats();
  if (view === "browse") renderBrowse();
}
$$("header nav button").forEach(b => b.addEventListener("click", () => show(b.dataset.nav)));

/* ---------- helpers ---------- */
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
/* Spaced-repetition weighting: unseen and recently-wrong questions surface first.
   Weighted random order via exponential sort keys. */
function weightedShuffle(pool) {
  return pool.map(q => {
    const st = store.data.qstats[qid(q)];
    let w;
    if (!st || !st.seen) w = 3;                 // never seen
    else if (st.streak === 0) w = 4;            // wrong last time
    else if (st.streak === 1) w = 2;            // shaky
    else w = 1;                                  // solid
    return { q, k: -Math.log(Math.random()) / w };
  }).sort((a, b) => a.k - b.k).map(x => x.q);
}
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const typeLabel = { mc: "Multiple choice", tf: "True / False", yn: "Yes / No", fib: "Fill in the blank", multi: "Choose all that apply", sign: "Identify the sign" };
const visualFor = q => {
  if (q.s && SIGNS[q.s]) return `<div class="qsign">${SIGNS[q.s].svg}</div>`;
  if (q.scn && SCENARIOS[q.scn]) return `<div class="qscn">${SCENARIOS[q.scn].svg}</div>`;
  const key = typeof pickVisual === "function" && pickVisual(q);
  return key && VISUALS[key] ? `<div class="qdecor">${VISUALS[key]}</div>` : "";
};

/* ---------- home ---------- */
function renderHome() {
  $("#statQ").textContent = QUESTIONS.length;
  $("#statBest").textContent = store.data.best ? `${store.data.best.score}/${store.data.best.total}` : "—";
  $("#statStreak").textContent = store.data.streak.count ? `${store.data.streak.count}🔥` : "0";
  $("#missedCount").textContent = store.data.missed.length;

  const grid = $("#categoryGrid");
  grid.innerHTML = "";
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const qs = QUESTIONS.filter(q => q.c === key);
    const done = qs.filter(q => store.data.mastered.includes(qid(q))).length;
    const pct = qs.length ? Math.round(done / qs.length * 100) : 0;
    const card = document.createElement("div");
    card.className = "card clickable";
    card.innerHTML = `<div class="icon">${cat.icon}</div><h3>${cat.name}</h3>
      <p>${qs.length} questions</p>
      <div class="mastery"><i style="width:${pct}%"></i></div>
      <div class="meta">${pct}% mastered · quiz me →</div>`;
    card.addEventListener("click", () => startQuiz(weightedShuffle(qs), { title: cat.name, instant: true }));
    grid.appendChild(card);
  }
}

/* ---------- streak ---------- */
function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const s = store.data.streak;
  if (s.last === today) return;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.count = (s.last === yesterday) ? s.count + 1 : 1;
  s.last = today;
}

/* ---------- quiz engine ---------- */
let quiz = null;

function startQuiz(questions, opts = {}) {
  if (!questions.length) { alert("No questions to review — nice work! 🎉"); return; }
  quiz = {
    questions,
    i: 0,
    answers: new Array(questions.length).fill(null),
    instant: opts.instant !== false,
    passMark: opts.passMark ?? null,
    isExam: !!opts.isExam,
    timerId: null,
    secondsLeft: opts.timed ? 30 * 60 : null
  };
  if (quiz.secondsLeft != null) {
    $("#qTimer").style.display = "";
    tickTimer();
    quiz.timerId = setInterval(tickTimer, 1000);
  } else {
    $("#qTimer").style.display = "none";
  }
  show("quiz");
  renderQuestion();
}

function tickTimer() {
  if (!quiz) return;
  const m = String(Math.floor(quiz.secondsLeft / 60)).padStart(2, "0");
  const s = String(quiz.secondsLeft % 60).padStart(2, "0");
  $("#qTimer").textContent = `${m}:${s}`;
  if (quiz.secondsLeft <= 0) { finishQuiz(); return; }
  quiz.secondsLeft--;
}

function renderQuestion() {
  const q = quiz.questions[quiz.i];
  $("#qCount").textContent = `${quiz.i + 1} / ${quiz.questions.length}`;
  $("#qProgress").style.width = (quiz.i / quiz.questions.length * 100) + "%";
  $("#submitAnswer").style.display = "none";
  $("#nextQuestion").style.display = "none";

  let html = `<span class="qtype">${typeLabel[q.t]}</span>`;
  html += visualFor(q);
  html += `<h3 class="qtext">${esc(q.q)}</h3>`;

  if (q.t === "fib") {
    html += `<div class="fib-row">
      <input class="fib-input" id="fibInput" type="text" autocomplete="off" placeholder="Type your answer…" aria-label="Your answer">
    </div>`;
  } else {
    const opts = (q.t === "tf") ? ["True", "False"] : (q.t === "yn") ? ["Yes", "No"] : q.o;
    html += `<div class="opts">` + opts.map((o, i) =>
      `<button class="opt" data-i="${i}"><span class="letter">${String.fromCharCode(65 + i)}</span>${esc(o)}</button>`
    ).join("") + `</div>`;
  }
  $("#qCard").innerHTML = html;
  speech.say(questionSpeech(q));

  if (q.t === "fib") {
    const input = $("#fibInput");
    input.focus();
    input.addEventListener("input", () => {
      $("#submitAnswer").style.display = input.value.trim() ? "" : "none";
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && input.value.trim()) submitCurrent(); });
  } else if (q.t === "multi") {
    $$("#qCard .opt").forEach(btn => btn.addEventListener("click", () => {
      btn.classList.toggle("selected");
      $("#submitAnswer").style.display = $$("#qCard .opt.selected").length ? "" : "none";
    }));
  } else {
    $$("#qCard .opt").forEach(btn => btn.addEventListener("click", () => {
      $$("#qCard .opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      submitCurrent();
    }));
  }
}

function evaluate(q, given) {
  if (q.t === "fib") {
    // tolerate units and symbols: "15 ft", "0.08%", "$2,500" all match
    const norm = s => s.toLowerCase()
      .replace(/[$,%]/g, "")
      .replace(/\b(feet|foot|ft|inches|inch|mph|miles per hour|seconds|second|secs?|percent|days?|hours?|sides?)\b/g, "")
      .replace(/\s+/g, " ").trim();
    return q.a.some(acc => norm(acc) === norm(given));
  }
  if (q.t === "tf") return (given === 0) === q.a;
  if (q.t === "yn") return (given === 0) === q.a;
  if (q.t === "multi") {
    const want = q.a.slice().sort().join(",");
    return given.slice().sort().join(",") === want;
  }
  return given === q.a;   // mc / sign
}

function correctText(q) {
  if (q.t === "fib") return q.a[0];
  if (q.t === "tf") return q.a ? "True" : "False";
  if (q.t === "yn") return q.a ? "Yes" : "No";
  if (q.t === "multi") return q.a.map(i => q.o[i]).join(" · ");
  return q.o[q.a];
}

function submitCurrent() {
  const q = quiz.questions[quiz.i];
  let given;
  if (q.t === "fib") given = $("#fibInput").value;
  else if (q.t === "multi") given = $$("#qCard .opt.selected").map(b => +b.dataset.i);
  else {
    const sel = $("#qCard .opt.selected");
    if (!sel) return;
    given = +sel.dataset.i;
  }
  const ok = evaluate(q, given);
  quiz.answers[quiz.i] = { given, ok };
  recordResult(q, ok);

  if (quiz.instant) revealFeedback(q, given, ok);
  advanceButtons();
}

function revealFeedback(q, given, ok) {
  speech.stop();
  if (q.t === "fib") {
    const input = $("#fibInput");
    input.disabled = true;
    input.classList.add(ok ? "correct" : "wrong");
  } else {
    const correctSet = q.t === "multi" ? q.a
      : q.t === "tf" || q.t === "yn" ? [q.a ? 0 : 1]
      : [q.a];
    $$("#qCard .opt").forEach(btn => {
      btn.disabled = true;
      const i = +btn.dataset.i;
      if (correctSet.includes(i)) btn.classList.add("correct");
      else if (btn.classList.contains("selected")) btn.classList.add("wrong");
      btn.classList.remove("selected");
    });
  }
  const div = document.createElement("div");
  div.className = "explain" + (ok ? "" : " bad");
  div.setAttribute("aria-live", "polite");
  div.innerHTML = `<b>${ok ? "✅ Correct!" : "❌ Not quite — correct answer: " + esc(correctText(q))}</b><br>${esc(q.e)}`;
  $("#qCard").appendChild(div);
  if (store.data.audio) speech.say((ok ? "Correct. " : "Not quite. The correct answer is " + correctText(q) + ". ") + q.e);
}

function advanceButtons() {
  $("#submitAnswer").style.display = "none";
  const last = quiz.i === quiz.questions.length - 1;
  const btn = $("#nextQuestion");
  btn.style.display = "";
  btn.textContent = last ? "Finish ✔" : "Next →";
  if (!quiz.instant) {
    // auto-advance in exam mode; the index guard stops a double advance if the
    // user clicks Next themselves inside the 250ms window
    const idx = quiz.i;
    btn.style.display = "none";
    setTimeout(() => { if (quiz && quiz.i === idx) { btn.style.display = ""; btn.click(); } }, 250);
  } else {
    btn.focus();
  }
}

function recordResult(q, ok) {
  const id = qid(q);
  const st = store.data.qstats[id] ||= { seen: 0, wrong: 0, streak: 0 };
  st.seen++;
  if (ok) st.streak++;
  else { st.wrong++; st.streak = 0; }
  if (ok) {
    if (!store.data.mastered.includes(id)) store.data.mastered.push(id);
    store.data.missed = store.data.missed.filter(x => x !== id);
  } else {
    if (!store.data.missed.includes(id)) store.data.missed.push(id);
    store.data.mastered = store.data.mastered.filter(x => x !== id);
  }
  bumpStreak();
  store.save();
}

$("#submitAnswer").addEventListener("click", submitCurrent);
$("#nextQuestion").addEventListener("click", () => {
  if (!quiz) return;
  if (quiz.i < quiz.questions.length - 1) { quiz.i++; renderQuestion(); }
  else finishQuiz();
});
$("#quitQuiz").addEventListener("click", () => {
  if (confirm("Quit this quiz? Progress on answered questions is saved.")) endQuiz("home");
});

function endQuiz(dest) {
  if (quiz?.timerId) clearInterval(quiz.timerId);
  quiz = null;
  show(dest);
}

function finishQuiz() {
  if (quiz.timerId) clearInterval(quiz.timerId);
  speech.stop();
  const total = quiz.questions.length;
  const score = quiz.answers.filter(a => a && a.ok).length;
  const passMark = quiz.passMark;
  const passed = passMark != null ? score >= passMark : null;

  if (quiz.isExam) {
    if (!store.data.best || score > store.data.best.score) store.data.best = { score, total };
    store.data.exams.push({ s: score, t: total, d: new Date().toISOString().slice(0, 10) });
    if (store.data.exams.length > 20) store.data.exams = store.data.exams.slice(-20);
    store.save();
  }

  const pct = Math.round(score / total * 100);
  const ringOffset = 408 - (408 * score / total);
  let html = `<div class="big">${passed === false ? "🌧️" : passed ? "🎉" : "📊"}</div>
    <div class="score-ring ${passed === false ? "fail" : ""}">
      <svg viewBox="0 0 150 150" width="150" height="150">
        <circle class="track" cx="75" cy="75" r="65"></circle>
        <circle class="fill" cx="75" cy="75" r="65"></circle>
      </svg>
      <div class="num">${score}/${total}<small>${pct}%</small></div>
    </div>`;
  if (passed != null) {
    html += `<div class="verdict ${passed ? "pass" : "fail"}">${passed ? "PASS — you'd have passed the real test!" : "Not yet — keep studying!"}</div>
      <div class="result-note">Oregon requires ${passMark}/${total} (80%) to pass the Class C knowledge test.</div>`;
  } else {
    html += `<div class="verdict ${pct >= 80 ? "pass" : ""}">${pct >= 80 ? "Great work!" : "Keep practicing!"}</div>`;
  }
  html += `<div class="result-note">Remember: this is an unofficial review — answers on the real test may vary.</div>`;
  $("#resultCard").innerHTML = html;

  const list = $("#reviewList");
  list.innerHTML = "";
  quiz.questions.forEach((q, i) => {
    const a = quiz.answers[i];
    const ok = a && a.ok;
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `<span class="tag ${ok ? "ok" : "bad"}">${ok ? "CORRECT" : "MISSED"}</span>
      <p><b>${i + 1}.</b> ${esc(q.q)}</p>
      <p class="ans">✔ ${esc(correctText(q))}</p>
      <p style="color:var(--muted)">${esc(q.e)}</p>`;
    list.appendChild(item);
  });

  const savedQuiz = quiz;
  quiz = null;
  show("results");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = $("#resultCard .fill");
    if (fill) fill.style.strokeDashoffset = ringOffset;
  }));
  if (passed) confetti();
  $("#retakeBtn").textContent = savedQuiz.isExam ? "Take another test" : "Retry these questions";
  $("#retakeBtn").onclick = () => savedQuiz.isExam
    ? beginExam()
    : startQuiz(shuffle(savedQuiz.questions), { instant: savedQuiz.instant });
}

$("#resultsHome").addEventListener("click", () => show("home"));

function confetti() {
  const card = $("#resultCard");
  const colors = ["#e8a33d", "#2e9e5b", "#274c77", "#d64545", "#7fa8d9"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (1.6 + Math.random() * 1.8) + "s";
    c.style.animationDelay = Math.random() * .8 + "s";
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    card.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}

/* ---------- exam setup ---------- */
let examOpts = { instant: true, timed: false };
$("#startExam").addEventListener("click", () => {
  $("#examSetup").style.display = "";
  $("#examSetup").scrollIntoView({ behavior: "smooth", block: "center" });
});
$("#cancelExam").addEventListener("click", () => $("#examSetup").style.display = "none");
$$("#examSetup .chip[data-fb]").forEach(c => c.addEventListener("click", () => {
  $$("#examSetup .chip[data-fb]").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
  examOpts.instant = c.dataset.fb === "instant";
}));
$$("#examSetup .chip[data-timer]").forEach(c => c.addEventListener("click", () => {
  $$("#examSetup .chip[data-timer]").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
  examOpts.timed = c.dataset.timer === "on";
}));
function beginExam() {
  $("#examSetup").style.display = "none";
  startQuiz(shuffle(QUESTIONS).slice(0, 35),   // exam stays uniformly random, like the real thing
    { instant: examOpts.instant, timed: examOpts.timed, passMark: 28, isExam: true });
}
$("#beginExam").addEventListener("click", beginExam);

$("#startSignQuiz").addEventListener("click", () =>
  startQuiz(weightedShuffle(QUESTIONS.filter(q => q.t === "sign")), { instant: true }));
$("#signsQuizBtn").addEventListener("click", () =>
  startQuiz(weightedShuffle(QUESTIONS.filter(q => q.t === "sign")), { instant: true }));
$("#startMissed").addEventListener("click", () =>
  startQuiz(shuffle(store.data.missed.map(i => QUESTIONS[i]).filter(Boolean)), { instant: true }));

/* ---------- flashcards ---------- */
let flashCat = "all";
let flash = null;

function startFlashcards(cat) {
  flashCat = cat || "all";
  const catsBar = $("#flashCats");
  catsBar.innerHTML = `<button class="chip ${flashCat === "all" ? "active" : ""}" data-c="all">All topics</button>` +
    Object.entries(CATEGORIES).map(([k, c]) =>
      `<button class="chip ${flashCat === k ? "active" : ""}" data-c="${k}">${c.icon} ${c.name}</button>`).join("");
  $$("#flashCats .chip").forEach(b => b.addEventListener("click", () => startFlashcards(b.dataset.c)));

  const pool = flashCat === "all" ? QUESTIONS : QUESTIONS.filter(q => q.c === flashCat);
  flash = { deck: weightedShuffle(pool), i: 0, flipped: false, again: [], done: 0, total: pool.length };
  renderFlash();
}

function renderFlash() {
  if (!flash.deck.length && flash.again.length) {
    flash.deck = shuffle(flash.again);
    flash.again = [];
    flash.i = 0;
  }
  const card = $("#flashcard");
  card.classList.remove("flipped");
  flash.flipped = false;
  if (!flash.deck.length) {
    $("#flashFront").innerHTML = `<h3>🎓 Deck complete!</h3><p>You marked every card as known. Nice work.</p>`;
    $("#flashBack").innerHTML = "";
    $("#flashCount").textContent = `${flash.total} cards mastered`;
    return;
  }
  const q = flash.deck[flash.i];
  $("#flashFront").innerHTML = visualFor(q) +
    `<h3>${esc(q.q)}</h3><span class="hint">tap / space to flip</span>`;
  $("#flashBack").innerHTML =
    `<h3>✔ ${esc(correctText(q))}</h3><p>${esc(q.e)}</p><span class="hint">tap / space to flip back</span>`;
  $("#flashCount").textContent =
    `Card ${flash.done + 1} of ${flash.total}` +
    (flash.again.length ? ` · ${flash.again.length} queued for review` : "");
  speech.say(q.q);
}

function flashNext(known) {
  if (!flash.deck.length) return;
  const q = flash.deck[flash.i];
  if (known) { flash.done++; recordResult(q, true); }
  else flash.again.push(q);
  flash.deck.splice(flash.i, 1);
  if (flash.i >= flash.deck.length) flash.i = 0;
  renderFlash();
}

$("#flashcard").addEventListener("click", () => {
  if (!flash || !flash.deck.length) return;   // completed deck has nothing to flip
  const c = $("#flashcard");
  c.classList.toggle("flipped");
  if (c.classList.contains("flipped")) {
    const q = flash.deck[flash.i];
    speech.say(correctText(q) + ". " + q.e);
  }
});
$("#flashKnow").addEventListener("click", () => flashNext(true));
$("#flashAgain").addEventListener("click", () => flashNext(false));

document.addEventListener("keydown", e => {
  if (!$("#view-flash").classList.contains("active")) return;
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); $("#flashcard").click(); }
  if (e.key === "ArrowRight") flashNext(true);
  if (e.key === "ArrowLeft") flashNext(false);
});

/* ---------- signs gallery ---------- */
function renderSignGallery() {
  const grid = $("#signGrid");
  grid.innerHTML = "";
  for (const sign of Object.values(SIGNS)) {
    const tile = document.createElement("div");
    tile.className = "sign-tile";
    tile.innerHTML = `${sign.svg}<b>${sign.name}</b><span>${sign.meaning}</span>`;
    grid.appendChild(tile);
  }
}

/* ---------- stats ---------- */
function renderStats() {
  const st = store.data;
  const answered = Object.values(st.qstats).reduce((n, s) => n + (s.seen ? 1 : 0), 0);
  const attempts = Object.values(st.qstats).reduce((n, s) => n + s.seen, 0);
  const wrongs = Object.values(st.qstats).reduce((n, s) => n + s.wrong, 0);
  const acc = attempts ? Math.round((attempts - wrongs) / attempts * 100) : 0;

  $("#statsTiles").innerHTML = `
    <div class="card"><div class="icon">🔥</div><h3>${st.streak.count} day${st.streak.count === 1 ? "" : "s"}</h3><p>study streak</p></div>
    <div class="card"><div class="icon">🎯</div><h3>${acc}%</h3><p>overall accuracy (${attempts} answers)</p></div>
    <div class="card"><div class="icon">📚</div><h3>${answered}/${QUESTIONS.length}</h3><p>questions attempted</p></div>
    <div class="card"><div class="icon">🏆</div><h3>${st.best ? st.best.score + "/" + st.best.total : "—"}</h3><p>best practice-test score</p></div>`;

  // per-category accuracy
  const catBox = $("#statsCats");
  catBox.innerHTML = "";
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const qs = QUESTIONS.filter(q => q.c === key);
    let seen = 0, wrong = 0, mastered = 0;
    qs.forEach(q => {
      const s = st.qstats[qid(q)];
      if (s) { seen += s.seen; wrong += s.wrong; }
      if (st.mastered.includes(qid(q))) mastered++;
    });
    const a = seen ? Math.round((seen - wrong) / seen * 100) : 0;
    const m = Math.round(mastered / qs.length * 100);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<span>${cat.icon} ${cat.name}</span>
      <div class="mastery"><i style="width:${m}%"></i></div>
      <b>${seen ? a + "%" : "—"}</b>`;
    catBox.appendChild(row);
  }

  // exam history chart
  const exams = st.exams.slice(-10);
  const chart = $("#examChart");
  if (!exams.length) {
    chart.innerHTML = `<p style="color:var(--muted);font-size:.9rem;">No practice tests taken yet — your last 10 scores will chart here.</p>`;
    return;
  }
  const W = 460, H = 170, pad = 28, bw = Math.min(36, (W - pad * 2) / exams.length - 8);
  const passY = H - 20 - (28 / 35) * (H - 40);
  let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:520px">`;
  svg += `<line x1="${pad}" y1="${passY}" x2="${W - 8}" y2="${passY}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4"/>
          <text x="${W - 10}" y="${passY - 5}" font-size="10" fill="var(--accent)" text-anchor="end">pass · 28</text>`;
  exams.forEach((e, i) => {
    const h = (e.s / e.t) * (H - 40);
    const x = pad + i * ((W - pad * 2) / exams.length) + 4;
    const y = H - 20 - h;
    const pass = e.s >= 28;
    svg += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="5" fill="${pass ? "var(--correct)" : "var(--wrong)"}" opacity=".9"></rect>
            <text x="${x + bw / 2}" y="${y - 4}" font-size="10" fill="var(--muted)" text-anchor="middle">${e.s}</text>`;
  });
  svg += `</svg>`;
  chart.innerHTML = svg;
}

/* ---------- browse / search ---------- */
function renderBrowse() {
  const chipsBar = $("#browseCats");
  if (!chipsBar.dataset.built) {
    chipsBar.innerHTML = `<button class="chip active" data-c="all">All</button>` +
      Object.entries(CATEGORIES).map(([k, c]) => `<button class="chip" data-c="${k}">${c.icon} ${c.name}</button>`).join("");
    chipsBar.dataset.built = "1";
    $$("#browseCats .chip").forEach(b => b.addEventListener("click", () => {
      $$("#browseCats .chip").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      browseFilter();
    }));
    $("#browseSearch").addEventListener("input", browseFilter);
  }
  browseFilter();
}
function browseFilter() {
  const term = $("#browseSearch").value.toLowerCase().trim();
  const cat = $("#browseCats .chip.active")?.dataset.c || "all";
  const list = $("#browseList");
  list.innerHTML = "";
  let n = 0;
  QUESTIONS.forEach(q => {
    if (cat !== "all" && q.c !== cat) return;
    if (term && !(q.q + " " + correctText(q) + " " + q.e).toLowerCase().includes(term)) return;
    if (n >= 120) return;
    n++;
    const item = document.createElement("div");
    item.className = "review-item browse-item";
    item.innerHTML = `<span class="tag ok">${CATEGORIES[q.c].icon} ${typeLabel[q.t]}</span>
      <p><b>${esc(q.q)}</b></p>
      <div class="browse-answer" hidden>
        ${visualFor(q)}
        <p class="ans">✔ ${esc(correctText(q))}</p>
        <p style="color:var(--muted)">${esc(q.e)}</p>
      </div>
      <p class="reveal-hint" style="color:var(--green);font-size:.78rem;">tap to reveal answer</p>`;
    item.addEventListener("click", () => {
      item.querySelector(".browse-answer").hidden = !item.querySelector(".browse-answer").hidden;
      item.querySelector(".reveal-hint").hidden = !item.querySelector(".browse-answer").hidden;
    });
    list.appendChild(item);
  });
  $("#browseCount").textContent = n >= 120 ? `showing first 120 matches — refine your search` : `${n} question${n === 1 ? "" : "s"}`;
}

/* ---------- misc ---------- */
$("#resetProgress").addEventListener("click", () => {
  if (confirm("Erase all saved scores and progress on this device?")) {
    localStorage.removeItem(LS_KEY);
    location.reload();
  }
});

/* animated scenario embeds on the Drive Test page */
$$(".scn-embed").forEach(el => {
  const scn = SCENARIOS[el.dataset.scn];
  if (scn) el.innerHTML = `<div class="qscn">${scn.svg}</div>`;
});

syncAudioButtons();
renderHome();
})();
