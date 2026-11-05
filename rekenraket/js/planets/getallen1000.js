import { pick, rand, slot } from '../util.js';

// Getallen tot 1000: honderdtallen, tientallen en eenheden, buren, vergelijken
// en afronden.
const NAMES = ['honderdtallen', 'tientallen', 'eenheden'];

function opbouw() {
  const n = rand(101, 999);
  const digits = String(n).split('').map(Number);
  if (Math.random() < 0.4) {
    return {
      key: `samen-${n}`,
      prompt: 'Welk getal is dit?',
      answer: n,
      maxDigits: 3,
      html: `
        <div class="build">
          ${digits.map((d, i) => `<span class="build-row"><b>${d}</b> ${NAMES[i]}</span>`).join('')}
          <span class="build-row">= ${slot()}</span>
        </div>`,
    };
  }
  const ask = rand(0, 2);
  return {
    key: `deel-${n}-${ask}`,
    prompt: `Hoeveel ${NAMES[ask]}?`,
    answer: digits[ask],
    html: `
      <div class="build">
        <span class="build-number">${n}</span>
        ${digits.map((d, i) => `<span class="build-row">${i === ask ? slot() : `<b>${d}</b>`} ${NAMES[i]}</span>`).join('')}
      </div>`,
  };
}

// Ervoor, erna, 10 of 100 meer of minder. Vaak rond een honderdtal: na 399 komt 400.
function buren() {
  const kind = pick(['na', 'voor', '+10', '-10', '+100', '-100']);
  const step = { na: 1, voor: -1, '+10': 10, '-10': -10, '+100': 100, '-100': -100 }[kind];
  let n = rand(110, 890);
  if (Math.random() < 0.4 && Math.abs(step) === 1) n = 100 * rand(2, 9) - (step > 0 ? 1 : 0);
  const prompt = {
    na: `Welk getal komt na ${n}?`, voor: `Welk getal komt vóór ${n}?`,
    '+10': `Wat is 10 meer dan ${n}?`, '-10': `Wat is 10 minder dan ${n}?`,
    '+100': `Wat is 100 meer dan ${n}?`, '-100': `Wat is 100 minder dan ${n}?`,
  }[kind];
  return {
    key: `b-${kind}-${n}`,
    prompt,
    answer: n + step,
    maxDigits: 3,
    html: `<div class="sequence">${step > 0 ? `<span>${n}</span>${slot()}` : `${slot()}<span>${n}</span>`}</div>`,
  };
}

// Let op de plek van de cijfers: 465 of 456?
function vergelijken() {
  const a = rand(100, 999);
  const digits = String(a).split('');
  let b;
  const roll = Math.random();
  if (roll < 0.4) b = Number([digits[0], digits[2], digits[1]].join(''));
  else if (roll < 0.5) b = a;
  else b = a + pick([-1, 1]) * pick([1, 10, 100, rand(2, 90)]);
  if (b < 100 || b > 999) b = a + 1;
  const answer = a < b ? '<' : a > b ? '>' : '=';
  return {
    key: `v-${a}-${b}`,
    prompt: 'Kies <, > of =',
    answer,
    choices: ['<', '=', '>'],
    html: `<div class="sum"><span>${a}</span><span class="compare-box">?</span><span>${b}</span></div>`,
    onSolved(el) {
      el.querySelector('.compare-box').textContent = answer;
    },
  };
}

// Afronden: 347 ligt dichter bij 350 dan bij 340.
function afronden() {
  const n = rand(101, 989);
  const on = Math.random() < 0.6 ? 10 : 100;
  return {
    key: `a-${n}-${on}`,
    prompt: `Rond ${n} af op ${on === 10 ? 'tientallen' : 'honderdtallen'}.`,
    answer: Math.round(n / on) * on,
    maxDigits: 4,
    html: `<div class="sum"><span>${n}</span><span class="op">≈</span>${slot()}</div>`,
  };
}

export default {
  intro: 'Een getal tot 1000 heeft <b>honderdtallen</b>, <b>tientallen</b> en <b>eenheden</b>. 347 is 3 honderdtallen, 4 tientallen en 7 eenheden. Afronden: 347 ligt dichter bij <b>350</b> dan bij 340.',
  levels: [
    { id: 'opbouw', name: 'Honderdtallen', hint: '347 = 300 + 40 + 7', groups: [5] },
    { id: 'buren', name: 'Ervoor en erna', hint: 'Na 399 komt 400', groups: [5] },
    { id: 'vergelijken', name: 'Groter of kleiner', hint: '465 of 456?', groups: [5] },
    { id: 'afronden', name: 'Afronden', hint: '347 is ongeveer 350', groups: [5] },
  ],
  makeQuestion(level) {
    return { opbouw, buren, vergelijken, afronden }[level]();
  },
};
