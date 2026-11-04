import { pick, rand, slot } from '../util.js';

// Groep 3: tellen in sprongen, de opstap naar de tafels. "2, 4, 6, ?, 10"
function sequence(step, max) {
  const start = step * rand(0, max / step - 4);
  const numbers = Array.from({ length: 5 }, (_, i) => start + i * step);
  const missing = rand(1, 4);
  return {
    key: `seq-${step}-${start}-${missing}`,
    prompt: `Tel in sprongen van ${step}. Welk getal mist er?`,
    answer: numbers[missing],
    maxDigits: 3,
    html: `<div class="sequence">${numbers.map((n, i) => (i === missing ? slot() : `<span>${n}</span>`)).join('')}</div>`,
  };
}

// "4 × 5" betekent 4 groepjes van 5. Bij kleine sommen tekenen we de groepjes.
function multiply(tables) {
  const table = pick(tables);
  const times = rand(1, 10);
  const product = times * table;
  if (Math.random() < 0.15) {
    return {
      key: `x-${times}-${table}-missing`,
      prompt: 'Welk getal ontbreekt?',
      answer: times,
      maxDigits: 3,
      html: `<div class="sum">${slot()}<span class="op">×</span><span>${table}</span><span class="op">=</span><span>${product}</span></div>`,
    };
  }
  const dots = product <= 30 && times > 1
    ? `<div class="dot-groups" aria-hidden="true">${`<span class="dot-group" style="--cols:${Math.min(table, 5)}">${'<i></i>'.repeat(table)}</span>`.repeat(times)}</div>`
    : '';
  return {
    key: `x-${times}-${table}`,
    prompt: `${times} keer ${table}`,
    answer: product,
    maxDigits: 3,
    html: `<div class="sum"><span>${times}</span><span class="op">×</span><span>${table}</span><span class="op">=</span>${slot()}</div>${dots}`,
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

// Deeltafels: 56 : 8 is de omgekeerde som van 7 × 8.
function divide(tables) {
  const table = pick(tables);
  const times = rand(1, 10);
  return {
    key: `d-${times * table}-${table}`,
    prompt: 'Deel uit je hoofd',
    answer: times,
    maxDigits: 2,
    revealText: `${times * table} : ${table} = ${times}, want ${times} × ${table} = ${times * table}.`,
    html: `<div class="sum"><span>${times * table}</span><span class="op">:</span><span>${table}</span><span class="op">=</span>${slot()}</div>`,
  };
}

// Tafels met tientallen: 6 × 40 is 6 × 4 en dan × 10.
function tens() {
  const a = rand(2, 9);
  const b = 10 * rand(2, 9);
  return {
    key: `t-${a}-${b}`,
    prompt: `${a} keer ${b}`,
    answer: a * b,
    maxDigits: 3,
    html: `<div class="sum"><span>${a}</span><span class="op">×</span><span>${b}</span><span class="op">=</span>${slot()}</div>`,
  };
}

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LEVELS = {
  sprong2: () => sequence(2, 20),
  sprong510: () => (Math.random() < 0.5 ? sequence(5, 50) : sequence(10, 100)),
  t1210: () => multiply([1, 2, 10]),
  t5: () => multiply([5]),
  t34: () => multiply([3, 4]),
  mix: () => multiply([1, 2, 3, 4, 5, 10]),
  rijen: numberPattern,
  t6789: () => multiply([6, 7, 8, 9]),
  alle: () => multiply(ALL),
  deel: () => divide(ALL),
  tientallen: tens,
};

export default {
  intro: '<b>4 × 5</b> betekent 4 groepjes van 5. Tellen in sprongen helpt: 5, 10, 15, 20!',
  levels: [
    { id: 'sprong2', name: 'Sprongen van 2', hint: '2, 4, 6, 8…', groups: [3] },
    { id: 'sprong510', name: 'Sprongen van 5 en 10', hint: '5, 10, 15… en 10, 20, 30…', groups: [3] },
    { id: 't1210', name: 'Tafel van 1, 2 en 10', hint: 'De makkelijkste tafels', groups: [4] },
    { id: 't5', name: 'Tafel van 5', hint: '5, 10, 15, 20…', groups: [4] },
    { id: 't34', name: 'Tafel van 3 en 4', hint: '3, 6, 9… en 4, 8, 12…', groups: [4] },
    { id: 'mix', name: 'Alles door elkaar', hint: 'Tafels 1 t/m 5 en 10', groups: [4] },
    { id: 'rijen', name: 'Getallenrijen', hint: 'Zoals 3, 6, 9, ?', groups: [4, 5] },
    { id: 't6789', name: 'Tafel van 6, 7, 8 en 9', hint: 'De moeilijkste tafels', groups: [5] },
    { id: 'alle', name: 'Alle tafels', hint: 'Tafels 1 t/m 10 door elkaar', groups: [5] },
    { id: 'deel', name: 'Deeltafels', hint: 'Zoals 56 : 8', groups: [5] },
    { id: 'tientallen', name: 'Keer met tientallen', hint: 'Zoals 6 × 40', groups: [5] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
