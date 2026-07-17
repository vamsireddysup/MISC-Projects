/* Oregon DMV Practice — app engine */
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

/* ---------- routing ---------- */
function show(view) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + view).classList.add("active");
  $$("header nav button").forEach(b => b.classList.toggle("active", b.dataset.nav === view));
  window.scrollTo({ top: 0 });
  if (view === "home") renderHome();
  if (view === "flash") startFlashcards(flashCat);
  if (view === "signs") renderSignGallery();
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
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const typeLabel = { mc: "Multiple choice", tf: "True / False", yn: "Yes / No", fib: "Fill in the blank", multi: "Choose all that apply", sign: "Identify the sign" };

/* ---------- home ---------- */
function renderHome() {
  $("#statQ").textContent = QUESTIONS.length;
  $("#statBest").textContent = store.data.best ? `${store.data.best.score}/${store.data.best.total}` : "—";
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
    card.addEventListener("click", () => startQuiz(shuffle(qs), { title: cat.name, instant: true }));
    grid.appendChild(card);
  }
}

/* ---------- quiz engine ---------- */
let quiz = null;   // {questions, i, answers[], instant, timed, passMark, timerId, secondsLeft}

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
  if (quiz.secondsLeft <= 0) { finishQuiz(); return; }
  quiz.secondsLeft--;
  const m = String(Math.floor(quiz.secondsLeft / 60)).padStart(2, "0");
  const s = String(quiz.secondsLeft % 60).padStart(2, "0");
  $("#qTimer").textContent = `${m}:${s}`;
}

function renderQuestion() {
  const q = quiz.questions[quiz.i];
  $("#qCount").textContent = `${quiz.i + 1} / ${quiz.questions.length}`;
  $("#qProgress").style.width = (quiz.i / quiz.questions.length * 100) + "%";
  $("#submitAnswer").style.display = "none";
  $("#nextQuestion").style.display = "none";

  let html = `<span class="qtype">${typeLabel[q.t]}</span>`;
  if (q.s && SIGNS[q.s]) html += `<div class="qsign">${SIGNS[q.s].svg}</div>`;
  html += `<h3 class="qtext">${esc(q.q)}</h3>`;

  if (q.t === "fib") {
    html += `<div class="fib-row">
      <input class="fib-input" id="fibInput" type="text" autocomplete="off" placeholder="Type your answer…">
    </div>`;
  } else {
    const opts = (q.t === "tf") ? ["True", "False"] : (q.t === "yn") ? ["Yes", "No"] : q.o;
    html += `<div class="opts">` + opts.map((o, i) =>
      `<button class="opt" data-i="${i}"><span class="letter">${String.fromCharCode(65 + i)}</span>${esc(o)}</button>`
    ).join("") + `</div>`;
  }
  $("#qCard").innerHTML = html;

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
    const norm = s => s.toLowerCase().replace(/[$,]/g, "").trim();
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
  const opts = q.o;
  return opts[q.a];
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
  div.innerHTML = `<b>${ok ? "✅ Correct!" : "❌ Not quite — correct answer: " + esc(correctText(q))}</b><br>${esc(q.e)}`;
  $("#qCard").appendChild(div);
}

function advanceButtons() {
  $("#submitAnswer").style.display = "none";
  const last = quiz.i === quiz.questions.length - 1;
  const btn = $("#nextQuestion");
  btn.style.display = "";
  btn.textContent = last ? "Finish ✔" : "Next →";
  if (!quiz.instant) {
    // exam mode: auto-advance shortly after selection for smooth flow
    setTimeout(() => { if (quiz) btn.click(); }, 250);
  } else {
    btn.focus();
  }
}

function recordResult(q, ok) {
  const id = qid(q);
  if (ok) {
    if (!store.data.mastered.includes(id)) store.data.mastered.push(id);
    store.data.missed = store.data.missed.filter(x => x !== id);
  } else {
    if (!store.data.missed.includes(id)) store.data.missed.push(id);
    store.data.mastered = store.data.mastered.filter(x => x !== id);
  }
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
  const total = quiz.questions.length;
  const score = quiz.answers.filter(a => a && a.ok).length;
  const passMark = quiz.passMark;
  const passed = passMark != null ? score >= passMark : null;

  if (quiz.isExam) {
    if (!store.data.best || score > store.data.best.score) {
      store.data.best = { score, total };
      store.save();
    }
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

  // review list
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
  $("#retakeBtn").onclick = () => savedQuiz.isExam ? beginExam() : show("home");
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
  startQuiz(shuffle(QUESTIONS).slice(0, 35),
    { instant: examOpts.instant, timed: examOpts.timed, passMark: 28, isExam: true, title: "Practice Test" });
}
$("#beginExam").addEventListener("click", beginExam);

$("#startSignQuiz").addEventListener("click", () =>
  startQuiz(shuffle(QUESTIONS.filter(q => q.t === "sign")), { instant: true }));
$("#signsQuizBtn").addEventListener("click", () =>
  startQuiz(shuffle(QUESTIONS.filter(q => q.t === "sign")), { instant: true }));
$("#startMissed").addEventListener("click", () =>
  startQuiz(shuffle(store.data.missed.map(i => QUESTIONS[i]).filter(Boolean)), { instant: true }));

/* ---------- flashcards ---------- */
let flashCat = "all";
let flash = null;  // {deck, i, flipped, again[]}

function startFlashcards(cat) {
  flashCat = cat || "all";
  const catsBar = $("#flashCats");
  catsBar.innerHTML = `<button class="chip ${flashCat === "all" ? "active" : ""}" data-c="all">All topics</button>` +
    Object.entries(CATEGORIES).map(([k, c]) =>
      `<button class="chip ${flashCat === k ? "active" : ""}" data-c="${k}">${c.icon} ${c.name}</button>`).join("");
  $$("#flashCats .chip").forEach(b => b.addEventListener("click", () => startFlashcards(b.dataset.c)));

  const pool = flashCat === "all" ? QUESTIONS : QUESTIONS.filter(q => q.c === flashCat);
  flash = { deck: shuffle(pool), i: 0, flipped: false, again: [], done: 0, total: pool.length };
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
  $("#flashFront").innerHTML =
    (q.s && SIGNS[q.s] ? `<div class="qsign">${SIGNS[q.s].svg}</div>` : "") +
    `<h3>${esc(q.q)}</h3><span class="hint">tap / space to flip</span>`;
  $("#flashBack").innerHTML =
    `<h3>✔ ${esc(correctText(q))}</h3><p>${esc(q.e)}</p><span class="hint">tap / space to flip back</span>`;
  $("#flashCount").textContent =
    `Card ${flash.done + 1} of ${flash.total}` +
    (flash.again.length ? ` · ${flash.again.length} queued for review` : "");
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
  $("#flashcard").classList.toggle("flipped");
});
$("#flashKnow").addEventListener("click", () => flashNext(true));
$("#flashAgain").addEventListener("click", () => flashNext(false));

document.addEventListener("keydown", e => {
  if (!$("#view-flash").classList.contains("active")) return;
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); $("#flashcard").classList.toggle("flipped"); }
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

/* ---------- misc ---------- */
$("#resetProgress").addEventListener("click", () => {
  if (confirm("Erase all saved scores and progress on this device?")) {
    localStorage.removeItem(LS_KEY);
    location.reload();
  }
});

renderHome();
})();
