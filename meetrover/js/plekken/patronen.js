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

// Spiegelen: wat je links ziet, staat rechts precies andersom.
function mirror() {
  let row;
  // Een rij die van twee kanten hetzelfde is, verandert niet in de spiegel.
  do {
    row = Array.from({ length: rand(3, 4) }, () => pick(SYMBOLS.slice(0, 5)));
  } while (row.join('') === [...row].reverse().join(''));
  const answer = [...row].reverse().join('');
  const wrong = new Set([row.join('')]);
  for (let i = 0; wrong.size < 2 && i < 30; i++) {
    const w = shuffle(row).join('');
    if (w !== answer) wrong.add(w);
  }
  if (wrong.size < 2) wrong.add([...row.slice(1), SYMBOLS[6]].join(''));
  return {
    key: `s-${row.join('')}`,
    prompt: 'Wat zie je in de spiegel?',
    answer,
    choices: shuffle([answer, ...wrong]),
    revealText: 'In de spiegel staat alles andersom.',
    html: `<div class="mirror"><span>${row.join('')}</span><span class="mirror-line" aria-hidden="true"></span><span class="pattern-next">?</span></div>`,
  };
}

// Een plattegrond van de klas: wat ligt links, rechts, boven of onder iets?
const THINGS = ['🐶', '🌵', '📚', '🎈', '🧸', '⚽', '🎨', '🪑', '🍎'];
const DIRS = [['links van', 0, -1], ['rechts van', 0, 1], ['boven', -1, 0], ['onder', 1, 0]];

function map() {
  const grid = shuffle(THINGS);
  const [word, dr, dc] = pick(DIRS);
  // Kies iets waar in die richting nog een vakje naast ligt.
  const options = grid.map((_, i) => i).filter((i) => {
    const r = Math.floor(i / 3) + dr;
    const c = (i % 3) + dc;
    return r >= 0 && r < 3 && c >= 0 && c < 3;
  });
  const from = pick(options);
  const to = (Math.floor(from / 3) + dr) * 3 + (from % 3) + dc;
  const answer = grid[to];
  const others = shuffle(grid.filter((t, i) => i !== to && i !== from)).slice(0, 2);
  return {
    key: `k-${grid[from]}-${word}`,
    prompt: `Wat ligt er ${word} ${grid[from]}?`,
    answer,
    choices: shuffle([answer, ...others]),
    choiceStyle: 'big',
    revealText: `${answer} ligt ${word} ${grid[from]}.`,
    html: `<div class="floor-plan">${grid.map((t, i) => `<span${i === from ? ' class="here"' : ''}>${t}</span>`).join('')}</div>`,
  };
}

const LEVELS = {
  patroon: pattern,
  vormen: () => shapeName(['cirkel', 'driehoek', 'vierkant', 'rechthoek']),
  vormen4: () => shapeName(Object.keys(SHAPES)),
  hoeken: corners,
  spiegelen: mirror,
  plattegrond: map,
};

export default {
  intro: 'Een patroon herhaalt zich steeds. Zoek het stukje dat telkens terugkomt, dan weet je wat er daarna komt! In de <b>spiegel</b> staat alles andersom, en op een <b>plattegrond</b> kijk je van bovenaf.',
  levels: [
    { id: 'patroon', name: 'Wat komt erna?', hint: '🔴🔵🔴🔵…', groups: [3, 4] },
    { id: 'vormen', name: 'Vormen', hint: 'Cirkel, driehoek, vierkant…', groups: [3] },
    { id: 'vormen4', name: 'Meer vormen', hint: 'Ook vijfhoek en zeshoek', groups: [4] },
    { id: 'hoeken', name: 'Hoeken tellen', hint: 'Hoeveel hoeken heeft het?', groups: [4] },
    { id: 'spiegelen', name: 'Spiegelen', hint: 'Wat zie je in de spiegel?', groups: [3, 4] },
    { id: 'plattegrond', name: 'Plattegrond', hint: 'Links, rechts, boven of onder?', groups: [3, 4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
