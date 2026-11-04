import { pick, rand, shuffle, slot } from '../util.js';

// Wat kozen de kinderen in de klas? Eerst in een turftabel, later in een
// staafgrafiek. Je leest af hoeveel, wat het meest is en hoeveel meer.
const THEMES = [
  ['🍎', '🍌', '🍐', '🍓'],
  ['🐶', '🐱', '🐰', '🐹'],
  ['⚽', '🚲', '🏊', '🛹'],
  ['🔴', '🔵', '🟢', '🟡'],
  ['🍦', '🍰', '🍪', '🍫'],
];

// Vier streepjes en een vijfde er schuin doorheen, zoals op school.
function tally(n) {
  const groups = [];
  for (let start = 0; start < n; start += 5) groups.push(Math.min(5, n - start));
  const width = groups.length * 34;
  const lines = groups.map((count, g) => {
    const x = g * 34 + 4;
    const sticks = Array.from({ length: Math.min(count, 4) }, (_, i) =>
      `<line x1="${x + i * 6}" y1="4" x2="${x + i * 6}" y2="30" />`).join('');
    return sticks + (count === 5 ? `<line x1="${x - 3}" y1="26" x2="${x + 21}" y2="8" />` : '');
  }).join('');
  return `<svg class="tally" viewBox="0 0 ${width} 34" width="${width}" aria-hidden="true">${lines}</svg>`;
}

// Kies verschillende aantallen, dan is er altijd één het meest en het minst.
function data(count, max) {
  const items = shuffle(pick(THEMES)).slice(0, count);
  const values = shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, count);
  return items.map((pic, i) => ({ pic, value: values[i] }));
}

function ask(rows, kinds) {
  const kind = pick(kinds);
  const most = rows.reduce((a, b) => (b.value > a.value ? b : a));
  const least = rows.reduce((a, b) => (b.value < a.value ? b : a));
  const choices = rows.map((r) => r.pic);
  if (kind === 'meest' || kind === 'minst') {
    const answer = (kind === 'meest' ? most : least).pic;
    return {
      key: `${kind}`,
      text: kind === 'meest' ? 'Wat is het meest gekozen?' : 'Wat is het minst gekozen?',
      answer,
      choices,
    };
  }
  if (kind === 'verschil') {
    const [a, b] = shuffle(rows).slice(0, 2).sort((x, y) => y.value - x.value);
    return {
      key: `v-${a.pic}-${b.pic}`,
      text: `Hoeveel kinderen meer kozen ${a.pic} dan ${b.pic}?`,
      answer: a.value - b.value,
    };
  }
  if (kind === 'samen') {
    const [a, b] = shuffle(rows).slice(0, 2);
    return { key: `s-${a.pic}-${b.pic}`, text: `Hoeveel kinderen kozen ${a.pic} en ${b.pic} samen?`, answer: a.value + b.value };
  }
  const row = pick(rows);
  return { key: `h-${row.pic}`, text: `Hoeveel kinderen kozen ${row.pic}?`, answer: row.value };
}

function question(html, q) {
  return {
    key: `${q.key}-${html.length}-${q.answer}`,
    prompt: 'Lees goed af!',
    answer: q.answer,
    choices: q.choices,
    choiceStyle: q.choices ? 'big' : undefined,
    revealText: q.choices ? 'Kijk nog eens goed: deze is het.' : `Het goede antwoord is ${q.answer}.`,
    html: `${html}<p class="chart-question">${q.text}</p>${q.choices ? '' : `<div class="euro-answer">${slot()}</div>`}`,
  };
}

function tallyQuestion(kinds) {
  const rows = data(3, 12);
  const table = `<table class="tally-table"><tbody>${rows.map((r) =>
    `<tr><td class="tally-pic">${r.pic}</td><td>${tally(r.value)}</td></tr>`).join('')}</tbody></table>`;
  return question(table, ask(rows, kinds));
}

function barQuestion() {
  const rows = data(4, 10);
  const top = 10;
  const h = 200;
  const unit = (h - 20) / top;
  const grid = Array.from({ length: top + 1 }, (_, i) => {
    const y = h - i * unit;
    return `<line class="grid" x1="34" x2="330" y1="${y}" y2="${y}" />${i % 2 === 0 ? `<text x="20" y="${y + 4}">${i}</text>` : ''}`;
  }).join('');
  const colors = ['#ff6b81', '#5b9dff', '#3ddc84', '#ffcc33'];
  const bars = rows.map((r, i) => {
    const x = 52 + i * 72;
    return `<rect x="${x}" y="${h - r.value * unit}" width="44" height="${r.value * unit}" rx="4" fill="${colors[i]}" />`;
  }).join('');
  // De plaatjes staan als gewone tekst onder de staven; emoji in SVG worden vaag.
  const labels = rows.map((r, i) => `<span style="left:${((74 + i * 72) / 340) * 100}%">${r.pic}</span>`).join('');
  const chart = `
    <div class="bar-chart">
      <svg viewBox="0 0 340 ${h + 6}" aria-hidden="true">${grid}<line class="axis" x1="34" x2="330" y1="${h}" y2="${h}" />${bars}</svg>
      <div class="bar-labels" aria-hidden="true">${labels}</div>
    </div>`;
  return question(chart, ask(rows, ['hoeveel', 'hoeveel', 'meest', 'minst', 'verschil']));
}

const LEVELS = {
  turven: () => tallyQuestion(['hoeveel', 'hoeveel', 'meest', 'minst']),
  turven4: () => tallyQuestion(['hoeveel', 'meest', 'verschil', 'samen']),
  staaf: barQuestion,
};

export default {
  intro: 'Met <b>turven</b> houd je bij hoeveel het er zijn. Elk streepje is er één, en de vijfde gaat er schuin doorheen. Zo tel je makkelijk in vijfjes!',
  levels: [
    { id: 'turven', name: 'Turven', hint: 'Tel de streepjes', groups: [3, 4] },
    { id: 'turven4', name: 'Turven en rekenen', hint: 'Hoeveel meer? Hoeveel samen?', groups: [4] },
    { id: 'staaf', name: 'Staafgrafiek', hint: 'Hoe hoog is de staaf?', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
