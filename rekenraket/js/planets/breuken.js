import { pick, rand, shuffle, slot } from '../util.js';

// De eerste breuken: welk deel van de pizza is gekleurd, de helft of een kwart
// van een getal, en welke breuk is groter.
const GLYPH = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕', '1/6': '⅙', '1/8': '⅛' };
const FRACTIONS = Object.keys(GLYPH);
const NAME = { 2: 'de helft', 3: 'een derde', 4: 'een kwart', 5: 'een vijfde', 6: 'een zesde', 8: 'een achtste', 10: 'een tiende' };

const parts = (f) => f.split('/').map(Number);
const choice = (f) => ({ value: f, label: GLYPH[f] });

// Een pizza in gelijke stukken; de eerste `k` stukken zijn gekleurd.
function pie(k, n) {
  const slices = Array.from({ length: n }, (_, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const p = (a) => `${(50 + 44 * Math.cos(a)).toFixed(2)} ${(50 + 44 * Math.sin(a)).toFixed(2)}`;
    return `<path d="M50 50 L${p(a0)} A44 44 0 0 1 ${p(a1)} Z" class="slice${i < k ? ' on' : ''}"/>`;
  }).join('');
  return `<svg class="pie" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" class="crust"/>${slices}</svg>`;
}

function welkDeel() {
  const f = pick(FRACTIONS);
  const [k, n] = parts(f);
  const wrong = shuffle(FRACTIONS.filter((o) => o !== f)).slice(0, 2);
  return {
    key: `deel-${f}`,
    prompt: 'Welk deel van de pizza is gekleurd?',
    answer: f,
    choices: shuffle([f, ...wrong]).map(choice),
    revealText: `${k} van de ${n} stukken: dat is ${GLYPH[f]}.`,
    html: pie(k, n),
  };
}

// De helft van 12, een kwart van 20: delen door 2 of door 4.
function deelVan() {
  const n = pick([2, 2, 3, 4, 4, 5, 10]);
  const each = rand(2, n === 10 ? 9 : 10);
  const whole = n * each;
  return {
    key: `van-${n}-${whole}`,
    prompt: `Hoeveel is ${NAME[n]} van ${whole}?`,
    answer: each,
    maxDigits: 3,
    revealText: `${whole} : ${n} = ${each}`,
    html: `<div class="sum"><span>${n === 10 ? '1/10' : GLYPH[`1/${n}`]}</span><span class="half-label">van</span><span>${whole}</span><span class="op">=</span>${slot()}</div>`,
  };
}

// Welke is groter? Hoe meer stukken, hoe kleiner elk stuk.
function groter() {
  const [a, b] = shuffle(['1/2', '1/3', '1/4', '1/5', '1/6', '1/8']).slice(0, 2);
  const answer = parts(a)[1] < parts(b)[1] ? a : b;
  return {
    key: `groter-${[a, b].sort().join('-')}`,
    prompt: 'Welk stuk is groter?',
    answer,
    choices: [a, b].map(choice),
    choiceStyle: 'big',
    revealText: `${GLYPH[answer]} is groter: in minder stukken verdeeld, dus elk stuk is groter.`,
    html: `<div class="pies">${pie(1, parts(a)[1])}${pie(1, parts(b)[1])}</div>`,
  };
}

export default {
  intro: 'Een <b>breuk</b> is een deel van iets. Snij je een pizza in 4 gelijke stukken, dan is één stuk <b>een kwart</b>: ¼. Hoe meer stukken, hoe kleiner elk stuk!',
  levels: [
    { id: 'deel', name: 'Welk deel?', hint: '½, ⅓ en ¼ van een pizza', groups: [5] },
    { id: 'van', name: 'Deel van een getal', hint: 'De helft van 12, een kwart van 20', groups: [5] },
    { id: 'groter', name: 'Welke is groter?', hint: '½ of ¼?', groups: [5] },
  ],
  makeQuestion(level) {
    return { deel: welkDeel, van: deelVan, groter }[level]();
  },
};
