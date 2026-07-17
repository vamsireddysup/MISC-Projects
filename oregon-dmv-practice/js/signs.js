/* Inline SVG road signs used across the site.
   Drawn from scratch to resemble MUTCD-style Oregon signage. */
const SIGNS = {
  stop: {
    name: "Stop",
    meaning: "Come to a complete stop. Yield to vehicles and stop and stay stopped for pedestrians in marked or unmarked crosswalks. Enter when safe.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#c1121f" stroke="#fff" stroke-width="4"/><text x="50" y="60" font-size="26" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">STOP</text></svg>`
  },
  yield: {
    name: "Yield",
    meaning: "Reduce speed and yield right of way. Stop if needed, the same as you would for a stop sign.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="4,10 96,10 50,92" fill="#c1121f"/><polygon points="16,17 84,17 50,80" fill="#fff"/><text x="50" y="45" font-size="17" font-weight="800" fill="#c1121f" text-anchor="middle" font-family="Arial">YIELD</text></svg>`
  },
  doNotEnter: {
    name: "Do Not Enter",
    meaning: "Do not enter this road or freeway ramp. You will see this sign if you are going the wrong way.",
    svg: `<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="8" fill="#c1121f"/><circle cx="50" cy="50" r="38" fill="#c1121f" stroke="#fff" stroke-width="3"/><rect x="18" y="42" width="64" height="16" rx="3" fill="#fff"/><text x="50" y="30" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">DO NOT</text><text x="50" y="82" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">ENTER</text></svg>`
  },
  wrongWay: {
    name: "Wrong Way",
    meaning: "You are driving against traffic. Pull off to the side, stop, and cautiously turn around or back off the ramp.",
    svg: `<svg viewBox="0 0 100 60"><rect x="2" y="2" width="96" height="56" rx="5" fill="#c1121f"/><text x="50" y="26" font-size="16" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">WRONG</text><text x="50" y="48" font-size="16" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">WAY</text></svg>`
  },
  noLeftTurn: {
    name: "No Left Turn",
    meaning: "A red circle and slash means do not make the movement shown — here, no left turns allowed.",
    svg: `<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="10" fill="#fff" stroke="#333" stroke-width="2"/><path d="M62 70 V46 a12 12 0 0 0 -12 -12 H42 v-10 L26 38 l16 14 v-10 h8 a2 2 0 0 1 2 2 v26 z" fill="#111"/><circle cx="50" cy="50" r="42" fill="none" stroke="#c1121f" stroke-width="9"/><line x1="21" y1="21" x2="79" y2="79" stroke="#c1121f" stroke-width="9"/></svg>`
  },
  noUTurn: {
    name: "No U-Turn",
    meaning: "U-turns are prohibited at this location.",
    svg: `<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="10" fill="#fff" stroke="#333" stroke-width="2"/><path d="M34 72 V48 a16 16 0 0 1 32 0 v10 h9 L60 76 45 58 h9 v-10 a6 6 0 0 0 -12 0 v24 z" fill="#111"/><circle cx="50" cy="50" r="42" fill="none" stroke="#c1121f" stroke-width="9"/><line x1="21" y1="21" x2="79" y2="79" stroke="#c1121f" stroke-width="9"/></svg>`
  },
  speed55: {
    name: "Speed Limit 55",
    meaning: "Regulatory sign showing the maximum speed in miles per hour under ideal conditions.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="8" fill="#fff" stroke="#111" stroke-width="4"/><text x="40" y="28" font-size="14" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">SPEED</text><text x="40" y="45" font-size="14" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">LIMIT</text><text x="40" y="85" font-size="36" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">55</text></svg>`
  },
  oneWay: {
    name: "One Way",
    meaning: "Traffic flows only in the direction of the arrow.",
    svg: `<svg viewBox="0 0 120 50"><rect x="2" y="2" width="116" height="46" rx="4" fill="#111"/><polygon points="8,25 38,8 38,18 78,18 78,32 38,32 38,42" fill="#fff"/><text x="96" y="22" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">ONE</text><text x="96" y="38" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">WAY</text></svg>`
  },
  keepRight: {
    name: "Keep Right",
    meaning: "A traffic island, median or obstruction divides the road ahead. Keep to the right.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="8" fill="#fff" stroke="#111" stroke-width="3"/><text x="40" y="24" font-size="13" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">KEEP</text><text x="40" y="40" font-size="13" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">RIGHT</text><path d="M30 88 V72 q0 -10 10 -14 l8 -4 v-8 h-8 l14 -14 14 14 h-8 v14 q0 4 -6 7 l-9 4 q-3 2 -3 5 v12 z" fill="#111" transform="scale(0.72) translate(8,14)"/></svg>`
  },
  centerTurnLane: {
    name: "Center Lane Left Turn Only",
    meaning: "The center lane is shared for left turns by traffic from both directions. It is illegal to travel in it.",
    svg: `<svg viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="8" fill="#fff" stroke="#111" stroke-width="3"/><text x="50" y="22" font-size="12" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">CENTER LANE</text><path d="M35 70 v-14 q0 -8 8 -8 h2 v-8 l-16 12 16 12 v-8 h-2 z" fill="#111" transform="translate(-4,-6)"/><path d="M65 40 v14 q0 8 -8 8 h-2 v8 l16 -12 -16 -12 v8 h2 z" fill="#111" transform="translate(4,16)"/><text x="50" y="94" font-size="11" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">ONLY</text></svg>`
  },
  doNotPass: {
    name: "Do Not Pass",
    meaning: "Passing other vehicles is not allowed in this zone.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="8" fill="#fff" stroke="#111" stroke-width="4"/><text x="40" y="36" font-size="15" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">DO</text><text x="40" y="58" font-size="15" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">NOT</text><text x="40" y="80" font-size="15" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">PASS</text></svg>`
  },
  noTurnOnRed: {
    name: "No Turn On Red",
    meaning: "You may not turn during the red light. Wait for the signal to turn green.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="8" fill="#fff" stroke="#111" stroke-width="3"/><text x="40" y="28" font-size="13" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">NO</text><text x="40" y="48" font-size="13" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">TURN</text><text x="40" y="68" font-size="13" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">ON</text><text x="40" y="88" font-size="13" font-weight="700" fill="#c1121f" text-anchor="middle" font-family="Arial">RED</text></svg>`
  },
  hov: {
    name: "HOV Lane",
    meaning: "High Occupancy Vehicle lane — reserved for vehicles carrying at least the number of people shown on the sign.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="8" fill="#fff" stroke="#111" stroke-width="3"/><polygon points="40,14 58,40 40,66 22,40" fill="none" stroke="#111" stroke-width="4"/><text x="40" y="86" font-size="15" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">HOV 2+</text></svg>`
  },
  pedCrossing: {
    name: "Pedestrian Crossing",
    meaning: "Warning: be alert for people crossing your path ahead.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><circle cx="50" cy="30" r="6" fill="#111"/><path d="M50 38 l-9 12 -3 16 h5 l3 -13 4 5 v14 h6 v-16 l-5 -8 3 -8 6 6 6 -3 -9 -8z" fill="#111"/></svg>`
  },
  schoolZone: {
    name: "School Zone / Crossing",
    meaning: "Five-sided (pentagon) sign marking a school zone or school crossing. Actively look for children and be ready to stop.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,3 96,33 96,96 4,96 4,33" fill="#f6c700" stroke="#111" stroke-width="3"/><circle cx="38" cy="42" r="6" fill="#111"/><circle cx="62" cy="40" r="6" fill="#111"/><path d="M38 50 l-6 24 h5 l4 -16 4 16 h5 l-6 -24z" fill="#111"/><path d="M62 48 l-6 26 h5 l4 -17 4 17 h5 l-6 -26z" fill="#111"/></svg>`
  },
  curveRight: {
    name: "Curve Ahead",
    meaning: "Warning: there is a curve in the road ahead. Slow down before entering.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M42 78 V60 q0 -12 12 -14 h6" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round"/><polygon points="58,36 74,46 58,56" fill="#111"/></svg>`
  },
  windingRoad: {
    name: "Winding Road",
    meaning: "The road ahead contains a series of turns or curves.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M46 82 q14 -6 0 -16 t0 -16 q10 -6 4 -14" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/><polygon points="44,26 56,30 46,42" fill="#111"/></svg>`
  },
  slipperyWet: {
    name: "Slippery When Wet",
    meaning: "The pavement is unusually slick when wet. Slow down and increase following distance.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><rect x="42" y="26" width="16" height="10" rx="3" fill="#111"/><rect x="38" y="34" width="24" height="12" rx="4" fill="#111"/><circle cx="43" cy="49" r="4" fill="#111"/><circle cx="57" cy="49" r="4" fill="#111"/><path d="M32 62 q8 8 -2 14 M46 62 q8 8 -2 14 M60 62 q8 8 -2 14 M74 62 q8 8 -2 14" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/></svg>`
  },
  deer: {
    name: "Deer Crossing",
    meaning: "Deer often cross the road in this area. Be alert and slow down if you see wildlife.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M36 74 l4 -14 -6 -10 4 -8 6 6 4 -4 -2 -8 5 3 3 -7 3 7 5 -3 -2 8 6 4 6 -6 3 8 -7 10 4 14 h-6 l-4 -12 -10 2 -8 -2 -3 12z" fill="#111"/></svg>`
  },
  signalAhead: {
    name: "Signal Ahead",
    meaning: "A traffic signal is ahead. Slow down and be ready to stop.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><rect x="40" y="24" width="20" height="52" rx="6" fill="#111"/><circle cx="50" cy="35" r="6" fill="#c1121f"/><circle cx="50" cy="50" r="6" fill="#f6c700"/><circle cx="50" cy="65" r="6" fill="#2a9d2a"/></svg>`
  },
  stopAhead: {
    name: "Stop Ahead",
    meaning: "There is a stop sign ahead. Slow down and prepare to stop.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><polygon points="42,28 58,28 68,38 68,54 58,64 42,64 32,54 32,38" fill="#c1121f" stroke="#fff" stroke-width="2"/><text x="50" y="51" font-size="10" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">STOP</text><rect x="46" y="66" width="8" height="14" fill="#111"/></svg>`
  },
  mergeLeft: {
    name: "Merge",
    meaning: "Traffic is merging from the side shown. Adjust speed and position to allow a smooth merge.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M46 80 V46 q0 -6 -6 -10 l-6 -5" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/><path d="M46 80 V30" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/><polygon points="46,18 56,34 36,34" fill="#111"/></svg>`
  },
  laneEnds: {
    name: "Lane Reduction (Lane Ends)",
    meaning: "The indicated lane ends soon. Vehicles in that lane must merge into the through lane.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M38 80 V22" fill="none" stroke="#111" stroke-width="7"/><path d="M62 80 V60 q0 -10 -10 -14" fill="none" stroke="#111" stroke-width="7"/></svg>`
  },
  twoWayTraffic: {
    name: "Two-Way Traffic Ahead",
    meaning: "The one-way road joins a two-way road ahead. You will be facing oncoming traffic.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M40 74 V40" stroke="#111" stroke-width="8" stroke-linecap="round"/><polygon points="40,24 50,42 30,42" fill="#111"/><path d="M60 26 V60" stroke="#111" stroke-width="8" stroke-linecap="round"/><polygon points="60,76 70,58 50,58" fill="#111"/></svg>`
  },
  dividedHwy: {
    name: "Divided Highway",
    meaning: "The highway ahead is divided by a median. Keep to the right.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M36 78 V54 q0 -10 8 -16" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/><path d="M64 78 V54 q0 -10 -8 -16" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/><ellipse cx="50" cy="66" rx="5" ry="14" fill="#111"/></svg>`
  },
  railroad: {
    name: "Railroad Advance Warning",
    meaning: "A railroad crossing is ahead. Look, listen, slow down — you may have to stop.",
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#f6c700" stroke="#111" stroke-width="3"/><line x1="24" y1="24" x2="76" y2="76" stroke="#111" stroke-width="8"/><line x1="76" y1="24" x2="24" y2="76" stroke="#111" stroke-width="8"/><text x="30" y="42" font-size="22" font-weight="800" fill="#111" font-family="Arial">R</text><text x="56" y="42" font-size="22" font-weight="800" fill="#111" font-family="Arial">R</text></svg>`
  },
  crossbuck: {
    name: "Railroad Crossbuck",
    meaning: "Marks the railroad crossing itself. It will include a yield or stop sign — obey the posted sign.",
    svg: `<svg viewBox="0 0 100 100"><g transform="rotate(-28 50 50)"><rect x="6" y="42" width="88" height="16" rx="3" fill="#fff" stroke="#111" stroke-width="2"/><text x="50" y="54" font-size="10" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">RAILROAD</text></g><g transform="rotate(28 50 50)"><rect x="6" y="42" width="88" height="16" rx="3" fill="#fff" stroke="#111" stroke-width="2"/><text x="50" y="54" font-size="10" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">CROSSING</text></g></svg>`
  },
  roundaboutAhead: {
    name: "Roundabout Ahead",
    meaning: "There is a circular intersection ahead. Traffic moves counterclockwise around a center island.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="none" stroke="#111" stroke-width="6"/><polygon points="50,22 58,34 42,34" fill="#111"/><polygon points="78,50 66,58 66,42" fill="#111"/><polygon points="50,78 42,66 58,66" fill="#111"/></svg>`
  },
  hill: {
    name: "Hill / Steep Grade",
    meaning: "A steep grade is ahead. Check your brakes and be ready for slow vehicles.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><polygon points="22,72 78,72 78,40" fill="#111"/><rect x="52" y="52" width="18" height="10" rx="2" fill="#f6c700"/><circle cx="57" cy="64" r="3.4" fill="#f6c700"/><circle cx="67" cy="64" r="3.4" fill="#f6c700"/></svg>`
  },
  lowClearance: {
    name: "Low Clearance",
    meaning: "The overpass ahead has low clearance. Do not proceed if your vehicle is too tall.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#f6c700" stroke="#111" stroke-width="3"/><path d="M26 66 V44 q24 -18 48 0 v22" fill="none" stroke="#111" stroke-width="6"/><text x="50" y="60" font-size="13" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">12'-6"</text></svg>`
  },
  advisorySpeed: {
    name: "Advisory Speed",
    meaning: "Advises the safe speed for freeway ramps and curves. Often posted with a curve warning sign.",
    svg: `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="8" fill="#f6c700" stroke="#111" stroke-width="3"/><text x="50" y="46" font-size="18" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">M.P.H.</text><text x="50" y="78" font-size="26" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">35</text></svg>`
  },
  workZone: {
    name: "Road Work Ahead",
    meaning: "Orange signs mark work zones. Slow down, expect changes, and remember traffic fines are doubled.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#e8710a" stroke="#111" stroke-width="3"/><text x="50" y="40" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">ROAD</text><text x="50" y="55" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">WORK</text><text x="50" y="70" font-size="11" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">AHEAD</text></svg>`
  },
  flagger: {
    name: "Flagger Ahead",
    meaning: "A flagger is directing traffic in a work zone ahead. Follow their signs and hand signals.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="#e8710a" stroke="#111" stroke-width="3"/><circle cx="46" cy="32" r="6" fill="#111"/><path d="M46 40 l-4 20 -4 16 h5 l4 -14 4 14 h5 l-4 -16 -2 -20z" fill="#111"/><line x1="50" y1="44" x2="68" y2="30" stroke="#111" stroke-width="4"/><rect x="64" y="20" width="12" height="12" fill="#111"/></svg>`
  },
  slowMoving: {
    name: "Slow Moving Vehicle",
    meaning: "Reflective orange triangle with red border displayed on farm equipment and other slow vehicles. Be prepared to slow down.",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,8 92,84 8,84" fill="#c1121f"/><polygon points="50,22 82,78 18,78" fill="#e8710a"/></svg>`
  },
  interstate: {
    name: "Interstate Route",
    meaning: "Route marker for an interstate highway.",
    svg: `<svg viewBox="0 0 100 100"><path d="M50 6 C 66 14, 84 12, 92 20 C 92 60, 76 84, 50 96 C 24 84, 8 60, 8 20 C 16 12, 34 14, 50 6z" fill="#1d3f8f" stroke="#fff" stroke-width="3"/><path d="M8 20 C16 12 34 14 50 6 C66 14 84 12 92 20 L92 34 L8 34z" fill="#c1121f"/><text x="50" y="26" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">INTERSTATE</text><text x="50" y="72" font-size="30" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">5</text></svg>`
  },
  hospital: {
    name: "Hospital Service Sign",
    meaning: "Blue motorist-service sign — indicates the road to a hospital.",
    svg: `<svg viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="8" fill="#1d5fb8"/><text x="50" y="72" font-size="60" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">H</text></svg>`
  },
  recreation: {
    name: "Recreational / Historic Sign",
    meaning: "Brown signs point to historic, cultural, scenic and recreational locations like parks and picnic grounds.",
    svg: `<svg viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="8" fill="#6b4a2b"/><polygon points="35,68 50,36 65,68" fill="#fff"/><polygon points="55,68 68,46 81,68" fill="#fff"/><rect x="20" y="70" width="60" height="5" fill="#fff"/></svg>`
  },
  guide: {
    name: "Guide / Exit Sign",
    meaning: "Green guide signs give exit information and show the direction of roads or cities.",
    svg: `<svg viewBox="0 0 120 70"><rect x="2" y="2" width="116" height="66" rx="6" fill="#0a7a3d" stroke="#fff" stroke-width="3"/><text x="60" y="30" font-size="15" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">Salem</text><text x="60" y="54" font-size="13" font-weight="700" fill="#fff" text-anchor="middle" font-family="Arial">EXIT 253</text></svg>`
  },
  schoolSpeed: {
    name: "School Speed Limit 20",
    meaning: "Reduced school speed of 20 mph applies as posted — when flashing, between 7 a.m. and 5 p.m. on school days, or when children are present.",
    svg: `<svg viewBox="0 0 80 120"><rect x="3" y="3" width="74" height="40" rx="4" fill="#f6c700" stroke="#111" stroke-width="2"/><text x="40" y="20" font-size="12" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">SCHOOL</text><text x="40" y="36" font-size="9" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">SPEED LIMIT</text><rect x="3" y="45" width="74" height="72" rx="4" fill="#fff" stroke="#111" stroke-width="3"/><text x="40" y="88" font-size="34" font-weight="800" fill="#111" text-anchor="middle" font-family="Arial">20</text><text x="40" y="110" font-size="9" font-weight="700" fill="#111" text-anchor="middle" font-family="Arial">WHEN FLASHING</text></svg>`
  },
  transitOnly: {
    name: "Transit Only Lane",
    meaning: "Only transit vehicles (and bikes if indicated) may continue straight in this lane. You may briefly enter only to turn where permitted.",
    svg: `<svg viewBox="0 0 80 100"><rect x="3" y="3" width="74" height="94" rx="6" fill="#fff" stroke="#111" stroke-width="3"/><rect x="20" y="14" width="40" height="30" rx="5" fill="#c1121f"/><rect x="26" y="20" width="28" height="10" fill="#fff"/><circle cx="28" cy="42" r="4" fill="#111"/><circle cx="52" cy="42" r="4" fill="#111"/><text x="40" y="68" font-size="13" font-weight="800" fill="#c1121f" text-anchor="middle" font-family="Arial">TRANSIT</text><text x="40" y="86" font-size="13" font-weight="800" fill="#c1121f" text-anchor="middle" font-family="Arial">ONLY</text></svg>`
  }
};
