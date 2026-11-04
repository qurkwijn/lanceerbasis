import { pick, rand, shuffle, slot } from '../util.js';

const COLORS = [
  { name: 'Rood', fill: '#ff6b81' },
  { name: 'Blauw', fill: '#5b9dff' },
  { name: 'Groen', fill: '#3ddc84' },
];

// Drie linten: welke is het langst of het kortst?
function longest() {
  const lengths = shuffle([rand(3, 5), rand(6, 8), rand(9, 12)]);
  const askLong = Math.random() < 0.6;
  const target = askLong ? Math.max(...lengths) : Math.min(...lengths);
  const answer = COLORS[lengths.indexOf(target)].name;
  // Niet allemaal links beginnen, dan moet je echt kijken.
  const bars = lengths.map((len, i) => {
    const x = 10 + rand(0, 40);
    return `<rect x="${x}" y="${12 + i * 34}" width="${len * 22}" height="20" rx="10" fill="${COLORS[i].fill}" />`;
  }).join('');
  return {
    key: `l-${lengths.join('-')}-${askLong}`,
    prompt: askLong ? 'Welke is het langst?' : 'Welke is het kortst?',
    answer,
    choices: COLORS.map((c) => c.name),
    html: `<svg class="ribbons" viewBox="0 0 330 110" aria-hidden="true">${bars}</svg>`,
  };
}

// Een potlood boven een rij blokjes of een liniaal.
function ruler(from, length, unit) {
  const total = 15;
  const scale = 300 / total;
  const marks = Array.from({ length: total + 1 }, (_, i) => `
    <line x1="${15 + i * scale}" x2="${15 + i * scale}" y1="58" y2="${i % 5 === 0 ? 74 : 68}" />
    ${unit === 'cm' ? `<text x="${15 + i * scale}" y="88">${i}</text>` : ''}`).join('');
  const blocks = unit === 'blokjes'
    ? Array.from({ length: total }, (_, i) => `<rect class="unit-block" x="${15 + i * scale + 1}" y="58" width="${scale - 2}" height="${scale - 2}" rx="3" />`).join('')
    : `<rect class="ruler-body" x="5" y="52" width="320" height="42" rx="6" />${marks}`;
  const x0 = 15 + from * scale;
  const x1 = 15 + (from + length) * scale;
  return `
    <svg class="ruler" viewBox="0 0 330 100" aria-hidden="true">
      ${blocks}
      <rect x="${x0}" y="24" width="${x1 - x0 - 14}" height="22" fill="#ffcc33" />
      <rect x="${x0}" y="24" width="10" height="22" fill="#ff8fa3" />
      <path d="M${x1 - 14} 24 L${x1} 35 L${x1 - 14} 46 Z" fill="#f4d9a8" />
      <line class="guide" x1="${x0}" x2="${x0}" y1="20" y2="58" />
      <line class="guide" x1="${x1}" x2="${x1}" y1="20" y2="58" />
    </svg>`;
}

function measure(unit) {
  const from = unit === 'cm' && Math.random() < 0.4 ? rand(1, 4) : 0;
  const length = rand(2, unit === 'cm' ? 15 - from : 12);
  return {
    key: `${unit}-${from}-${length}`,
    prompt: unit === 'cm'
      ? `Hoe lang is het potlood?${from ? ' Let op waar het begint!' : ''}`
      : 'Hoeveel blokjes lang is het potlood?',
    answer: length,
    html: `${ruler(from, length, unit)}<div class="euro-answer">${slot()}<span class="unit">${unit}</span></div>`,
  };
}

const FRUIT = ['🍉', '🎃', '🍍', '🥥', '🧀', '🎁'];

// Een weegschaal in evenwicht: links iets, rechts gewichten.
function weigh() {
  const weights = [];
  const count = rand(1, 3);
  for (let i = 0; i < count; i++) weights.push(pick([1, 2, 5]));
  weights.sort((a, b) => b - a);
  const total = weights.reduce((s, n) => s + n, 0);
  return {
    key: `w-${weights.join('-')}`,
    prompt: 'De weegschaal is in evenwicht. Hoeveel kilo weegt het?',
    answer: total,
    html: `
      <div class="scale">
        <div class="scale-beam">
          <div class="scale-pan"><span class="scale-thing">${pick(FRUIT)}</span></div>
          <div class="scale-pan">${weights.map((w) => `<span class="weight">${w} kg</span>`).join('')}</div>
        </div>
        <div class="scale-stand" aria-hidden="true"></div>
      </div>
      <div class="euro-answer">${slot()}<span class="unit">kg</span></div>`,
  };
}

const LEVELS = {
  langst: longest,
  blokjes: () => measure('blokjes'),
  liniaal: () => measure('cm'),
  wegen: weigh,
};

export default {
  intro: 'Meten doe je altijd vanaf het <b>begin</b>. Begint iets niet bij de 0 op je liniaal? Tel dan de stapjes tussen het begin en het eind.',
  levels: [
    { id: 'langst', name: 'Langst en kortst', hint: 'Kijk goed waar ze beginnen', groups: [3, 4] },
    { id: 'blokjes', name: 'Meten met blokjes', hint: 'Hoeveel blokjes lang?', groups: [3, 4] },
    { id: 'liniaal', name: 'Meten met de liniaal', hint: 'In centimeters', groups: [4] },
    { id: 'wegen', name: 'Wegen', hint: 'De weegschaal in evenwicht', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
