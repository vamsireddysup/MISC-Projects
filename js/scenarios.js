/* Animated SVG traffic scenarios (SMIL animations — no dependencies).
   Shared building blocks: gray road cross, dashed lane lines, colored car rects. */
const SCENARIOS = {
  fourWayStop: {
    name: "Four-way stop",
    svg: `<svg viewBox="0 0 220 220">
<rect x="0" y="0" width="220" height="220" fill="none"/>
<rect x="85" y="0" width="50" height="220" fill="#8a8f95"/>
<rect x="0" y="85" width="220" height="50" fill="#8a8f95"/>
<line x1="110" y1="0" x2="110" y2="80" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<line x1="110" y1="140" x2="110" y2="220" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<line x1="0" y1="110" x2="80" y2="110" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<line x1="140" y1="110" x2="220" y2="110" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<rect x="82" y="76" width="6" height="6" fill="#fff"/><rect x="132" y="138" width="6" height="6" fill="#fff"/>
<g><rect x="114" y="180" width="14" height="26" rx="4" fill="#1d5fb8"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 0 -40; 0 -40; 0 -190" keyTimes="0;.25;.5;1" dur="6s" repeatCount="indefinite"/></g>
<g><rect x="10" y="94" width="26" height="14" rx="4" fill="#c1121f"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 40 0; 40 0; 40 0; 190 0" keyTimes="0;.25;.5;.62;1" dur="6s" repeatCount="indefinite"/></g>
<text x="110" y="16" font-size="11" fill="#fff" text-anchor="middle" font-family="Arial">Blue arrived first → goes first</text>
</svg>`
  },
  uncontrolled: {
    name: "Uncontrolled intersection — yield to the right",
    svg: `<svg viewBox="0 0 220 220">
<rect x="85" y="0" width="50" height="220" fill="#8a8f95"/>
<rect x="0" y="85" width="220" height="50" fill="#8a8f95"/>
<line x1="110" y1="0" x2="110" y2="220" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<line x1="0" y1="110" x2="220" y2="110" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<g><rect x="114" y="180" width="14" height="26" rx="4" fill="#1d5fb8"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 0 -45; 0 -45; 0 -45" keyTimes="0;.3;.75;1" dur="5s" repeatCount="indefinite"/></g>
<g><rect x="185" y="94" width="26" height="14" rx="4" fill="#2a9d2a"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; -60 0; -200 0" keyTimes="0;.3;1" dur="5s" repeatCount="indefinite"/></g>
<text x="110" y="16" font-size="11" fill="#fff" text-anchor="middle" font-family="Arial">Blue yields to green (on its right)</text>
</svg>`
  },
  leftTurnYield: {
    name: "Left turn yields to oncoming traffic",
    svg: `<svg viewBox="0 0 220 220">
<rect x="85" y="0" width="50" height="220" fill="#8a8f95"/>
<rect x="0" y="85" width="220" height="50" fill="#8a8f95"/>
<line x1="110" y1="0" x2="110" y2="220" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<g><rect x="114" y="180" width="14" height="26" rx="4" fill="#1d5fb8"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 0 -55; 0 -55; -35 -85; -120 -85" keyTimes="0;.3;.6;.8;1" dur="6s" repeatCount="indefinite"/>
  <animateTransform attributeName="transform" type="rotate" additive="sum" values="0 121 193; 0 121 193; 0 121 193; -90 121 193; -90 121 193" keyTimes="0;.3;.6;.8;1" dur="6s" repeatCount="indefinite"/></g>
<g><rect x="92" y="-30" width="14" height="26" rx="4" fill="#c1121f"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 0 120; 0 260" keyTimes="0;.45;1" dur="6s" repeatCount="indefinite"/></g>
<text x="110" y="16" font-size="11" fill="#fff" text-anchor="middle" font-family="Arial">Wait for oncoming red car, then turn</text>
</svg>`
  },
  roundabout: {
    name: "Roundabout — yield, then counterclockwise",
    svg: `<svg viewBox="0 0 220 220">
<circle cx="110" cy="110" r="78" fill="#8a8f95"/>
<circle cx="110" cy="110" r="34" fill="#3f7a4f"/>
<rect x="96" y="0" width="28" height="36" fill="#8a8f95"/>
<rect x="96" y="184" width="28" height="36" fill="#8a8f95"/>
<rect x="0" y="96" width="36" height="28" fill="#8a8f95"/>
<rect x="184" y="96" width="36" height="28" fill="#8a8f95"/>
<g><rect x="-7" y="-13" width="14" height="26" rx="4" fill="#1d5fb8"/>
  <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"
    path="M110,214 L110,172 A56,56 0 1,1 166,110 L214,110" keyPoints="0;.14;.2;.85;1" keyTimes="0;.2;.32;.82;1" calcMode="linear"/></g>
<g opacity=".9"><rect x="-7" y="-13" width="14" height="26" rx="4" fill="#c1121f"/>
  <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"
    path="M166,110 A56,56 0 1,0 110,166 A56,56 0 1,0 166,110"/></g>
<text x="110" y="14" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">Blue yields, merges counterclockwise, exits right</text>
</svg>`
  },
  schoolBus: {
    name: "School bus, red lights flashing — painted median",
    svg: `<svg viewBox="0 0 220 220">
<rect x="0" y="60" width="220" height="104" fill="#8a8f95"/>
<line x1="0" y1="106" x2="220" y2="106" stroke="#f6c700" stroke-width="3"/>
<line x1="0" y1="118" x2="220" y2="118" stroke="#f6c700" stroke-width="3"/>
<g><rect x="140" y="66" width="56" height="24" rx="5" fill="#f6c700"/>
  <circle cx="146" cy="70" r="4" fill="#c1121f"><animate attributeName="opacity" values="1;.1;1" dur=".8s" repeatCount="indefinite"/></circle>
  <circle cx="190" cy="70" r="4" fill="#c1121f"><animate attributeName="opacity" values=".1;1;.1" dur=".8s" repeatCount="indefinite"/></circle>
  <text x="168" y="83" font-size="9" font-weight="700" text-anchor="middle" font-family="Arial">SCHOOL BUS</text></g>
<g><rect x="30" y="128" width="30" height="16" rx="4" fill="#1d5fb8"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 45 0; 45 0" keyTimes="0;.4;1" dur="5s" repeatCount="indefinite"/></g>
<g><rect x="20" y="66" width="30" height="16" rx="4" fill="#7a4dbd" transform="translate(0,0)"/>
  <animateTransform attributeName="transform" type="translate" values="60 0; 30 0; 30 0" keyTimes="0;.4;1" dur="5s" repeatCount="indefinite"/></g>
<text x="110" y="26" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">Painted median ≠ divided highway:</text>
<text x="110" y="42" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">ALL lanes stop for flashing red</text>
</svg>`
  },
  emergency: {
    name: "Emergency vehicle — pull right and stop",
    svg: `<svg viewBox="0 0 220 220">
<rect x="60" y="0" width="100" height="220" fill="#8a8f95"/>
<line x1="110" y1="0" x2="110" y2="220" stroke="#f6c700" stroke-width="2" stroke-dasharray="8 6"/>
<g><rect x="118" y="90" width="14" height="26" rx="4" fill="#1d5fb8"/>
  <animateTransform attributeName="transform" type="translate" values="0 0; 22 6; 22 6" keyTimes="0;.35;1" dur="4s" repeatCount="indefinite"/></g>
<g><rect x="118" y="215" width="16" height="30" rx="4" fill="#c1121f"/>
  <circle cx="126" cy="212" r="4" fill="#ff5252"><animate attributeName="opacity" values="1;.2;1" dur=".5s" repeatCount="indefinite"/></circle>
  <animateTransform attributeName="transform" type="translate" values="0 40; 0 -20; 0 -260" keyTimes="0;.35;1" dur="4s" repeatCount="indefinite"/></g>
<text x="110" y="16" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">Pull right, stop until it passes</text>
</svg>`
  },
  blindSpot: {
    name: "Lane change — mirror + shoulder check",
    svg: `<svg viewBox="0 0 220 220">
<rect x="40" y="0" width="140" height="220" fill="#8a8f95"/>
<line x1="110" y1="0" x2="110" y2="220" stroke="#fff" stroke-width="2" stroke-dasharray="10 8"/>
<g><rect x="66" y="120" width="16" height="30" rx="4" fill="#c1121f"/>
  <animateTransform attributeName="transform" type="translate" values="0 30; 0 -10; 0 -40" keyTimes="0;.5;1" dur="4s" repeatCount="indefinite"/></g>
<g><rect x="132" y="90" width="16" height="30" rx="4" fill="#1d5fb8"/>
  <animate attributeName="opacity" values="1;1;1" dur="4s" repeatCount="indefinite"/></g>
<path d="M140 88 q -26 -18 -46 6" fill="none" stroke="#f6c700" stroke-width="3" stroke-dasharray="5 4">
  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.3;.7;1" dur="4s" repeatCount="indefinite"/></path>
<text x="110" y="16" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">Red car hides in the blind spot —</text>
<text x="110" y="32" font-size="11" fill="#3a3f45" text-anchor="middle" font-family="Arial">shoulder check before moving</text>
</svg>`
  },
  noPassHill: {
    name: "No passing on hills and curves",
    svg: `<svg viewBox="0 0 220 220">
<path d="M0 170 Q 110 60 220 170 L220 220 L0 220 Z" fill="#6f9e6f"/>
<path d="M0 178 Q 110 70 220 178" fill="none" stroke="#8a8f95" stroke-width="26"/>
<path d="M0 178 Q 110 70 220 178" fill="none" stroke="#f6c700" stroke-width="3" stroke-dasharray="1 0"/>
<g><rect x="-8" y="-14" width="16" height="28" rx="4" fill="#1d5fb8"/>
  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path="M10,173 Q 110,70 210,173"/></g>
<g opacity=".85"><rect x="-8" y="-14" width="16" height="28" rx="4" fill="#c1121f"/>
  <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path="M210,173 Q 110,70 10,173"/></g>
<text x="110" y="30" font-size="12" fill="#3a3f45" text-anchor="middle" font-family="Arial">Hill blocks the view — solid line, no passing</text>
</svg>`
  }
};
