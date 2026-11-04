import { pick, rand, shuffle, slot } from '../util.js';

const SYMBOLS = ['🔴', '🔵', '🟡', '🟢', '⭐', '❤️', '🔺', '🟪'];
const SHAPES = {
  cirkel: { corners: 0 },
  driehoek: { corners: 3 },
  vierkant: { corners: 4 },
  rechthoek: { corners: 4 },
  vijfhoek: { corners: 5 },
  zeshoek: { corners: 6 },
};
const FILLS = ['#ff6b81', '#5b9dff', '#3ddc84', '#ffcc33', '#c49bff'];

// Wat komt er daarna? Patronen als AB, AAB, ABC en ABB.
function pattern() {
  const unitShape = pick(['AB', 'AAB', 'ABC', 'ABB', 'AABB']);
  const symbols = shuffle(SYMBOLS).slice(0, 3);
  const unit = [...unitShape].map((c) => symbols['ABC'.indexOf(c)]);
  const shown = rand(unit.length + 2, unit.length * 2 + 1);
  const row = Array.from({ length: shown + 1 }, (_, i) => unit[i % unit.length]);
  const answer = row.pop();
  const used = [...new Set(unit)];
  const extra = SYMBOLS.filter((s) => !used.includes(s));
  return {
    key: `p-${unitShape}-${row.join('')}`,
    prompt: 'Wat komt er hierna?',
    answer,
    choices: shuffle([...used, ...shuffle(extra)].slice(0, 3)),
    html: `<div class="pattern">${row.map((s) => `<span>${s}</span>`).join('')}<span class="pattern-next">?</span></div>`,
  };
}

function shapeSvg(name) {
  const fill = pick(FILLS);
  if (name === 'cirkel') return `<circle cx="80" cy="70" r="55" fill="${fill}" />`;
  if (name === 'vierkant') return `<rect x="25" y="15" width="110" height="110" rx="4" fill="${fill}" />`;
  if (name === 'rechthoek') return `<rect x="5" y="35" width="150" height="70" rx="4" fill="${fill}" />`;
  const n = SHAPES[name].corners;
  const points = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${(80 + 62 * Math.cos(a)).toFixed(1)},${(75 + 62 * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return `<polygon points="${points}" fill="${fill}" stroke-linejoin="round" />`;
}

const shapePicture = (name) =>
  `<svg class="shape" viewBox="0 0 160 140" aria-hidden="true" style="transform: rotate(${pick([0, 0, 15, -20, 90])}deg)">${shapeSvg(name)}</svg>`;

function shapeName(names) {
  const name = pick(names);
  return {
    key: `v-${name}-${Math.random()}`,
    prompt: 'Hoe heet deze vorm?',
    answer: name,
    choices: shuffle([name, ...shuffle(names.filter((n) => n !== name)).slice(0, 3)]),
    html: shapePicture(name),
  };
}

function corners() {
  const name = pick(Object.keys(SHAPES));
  return {
    key: `h-${name}`,
    prompt: 'Hoeveel hoeken heeft deze vorm?',
    answer: SHAPES[name].corners,
    html: `${shapePicture(name)}<div class="euro-answer">${slot()}<span class="unit">hoeken</span></div>`,
  };
}

// Getallenrijen: welke sprong zit erin?
function numberPattern() {
  const step = pick([2, 3, 4, 5, 10]) * (Math.random() < 0.35 ? -1 : 1);
  // Een aflopende rij begint hoog genoeg, zodat hij niet onder de 0 komt.
  const start = step > 0 ? rand(0, 20) : rand(-4 * step, -4 * step + 40);
  const numbers = Array.from({ length: 5 }, (_, i) => start + i * step);
  const missing = rand(2, 4);
  return {
    key: `g-${start}-${step}-${missing}`,
    prompt: 'Welk getal mist er?',
    answer: numbers[missing],
    maxDigits: 3,
    html: `<div class="sequence">${numbers.map((n, i) => (i === missing ? slot() : `<span>${n}</span>`)).join('')}</div>`,
  };
}

const LEVELS = {
  patroon: pattern,
  vormen: () => shapeName(['cirkel', 'driehoek', 'vierkant', 'rechthoek']),
  vormen4: () => shapeName(Object.keys(SHAPES)),
  hoeken: corners,
  getallen: numberPattern,
};

export default {
  intro: 'Een patroon herhaalt zich steeds. Zoek het stukje dat telkens terugkomt, dan weet je wat er daarna komt!',
  levels: [
    { id: 'patroon', name: 'Wat komt erna?', hint: '🔴🔵🔴🔵…', groups: [3, 4] },
    { id: 'vormen', name: 'Vormen', hint: 'Cirkel, driehoek, vierkant…', groups: [3] },
    { id: 'vormen4', name: 'Meer vormen', hint: 'Ook vijfhoek en zeshoek', groups: [4] },
    { id: 'hoeken', name: 'Hoeken tellen', hint: 'Hoeveel hoeken heeft het?', groups: [4] },
    { id: 'getallen', name: 'Getallenrijen', hint: 'Zoals 3, 6, 9, ?', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
