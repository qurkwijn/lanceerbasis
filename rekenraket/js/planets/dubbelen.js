import { rand, slot } from '../util.js';

function sum(a, b, key) {
  return {
    key,
    prompt: a === b ? 'Dubbel!' : 'Bijna dubbel!',
    answer: a + b,
    maxDigits: 3,
    html: `<div class="sum"><span>${a}</span><span class="op">+</span><span>${b}</span><span class="op">=</span>${slot()}</div>`,
  };
}

const LEVELS = {
  dubbel10() {
    const n = rand(1, 10);
    return sum(n, n, `d-${n}`);
  },
  // 6 + 7 is 6 + 6 en nog 1 erbij.
  bijna() {
    const n = rand(1, 9);
    return Math.random() < 0.5 ? sum(n, n + 1, `b-${n}`) : sum(n + 1, n, `b2-${n}`);
  },
  dubbel50() {
    const n = Math.random() < 0.5 ? 5 * rand(2, 10) : rand(11, 25);
    return sum(n, n, `d50-${n}`);
  },
  helft20: () => half(2 * rand(1, 10)),
  helft: () => half(2 * rand(1, 25)),
  even20: () => evenOdd(rand(1, 20)),
  even100: () => evenOdd(rand(21, 99)),
};

function half(n) {
  return {
      key: `h-${n}`,
      prompt: 'Wat is de helft?',
      answer: n / 2,
      html: `<div class="sum"><span class="half-label">de helft van</span><span>${n}</span><span class="op">=</span>${slot()}</div>`,
  };
}

// Even getallen kun je in tweetjes verdelen; bij oneven blijft er één over.
// Tot 20 tekenen we de tweetjes erbij.
function evenOdd(n) {
  const even = n % 2 === 0;
  const pairs = n <= 20
    ? `<div class="pairs" aria-hidden="true">${'<span class="pair"><i></i><i></i></span>'.repeat(Math.floor(n / 2))}${even ? '' : '<span class="pair"><i></i></span>'}</div>`
    : '';
  return {
    key: `e-${n}`,
    prompt: 'Is dit getal even of oneven?',
    answer: even ? 'even' : 'oneven',
    choices: ['even', 'oneven'],
    revealText: even ? `${n} is even.` : `${n} is oneven. Kijk naar het laatste cijfer!`,
    html: `<div class="sum"><span>${n}</span></div>${pairs}`,
  };
}

export default {
  intro: 'Dubbelen zijn sommen met twee keer hetzelfde getal, zoals 4 + 4. Weet je die? Dan is <b>4 + 5</b> makkelijk: dat is 4 + 4 en nog 1. Een dubbel is altijd <b>even</b>: je kunt het in tweetjes verdelen.',
  levels: [
    { id: 'dubbel10', name: 'Dubbelen tot 10 + 10', hint: 'Zoals 6 + 6', groups: [3, 4] },
    { id: 'bijna', name: 'Bijna dubbel', hint: 'Zoals 6 + 7', groups: [3, 4] },
    { id: 'dubbel50', name: 'Grote dubbelen', hint: 'Zoals 15 + 15 en 30 + 30', groups: [4] },
    { id: 'helft20', name: 'De helft tot 20', hint: 'De helft van 8 is…', groups: [3] },
    { id: 'helft', name: 'De helft', hint: 'De helft van 16 is…', groups: [4] },
    { id: 'even20', name: 'Even of oneven', hint: 'Kun je het in tweetjes verdelen?', groups: [3, 4] },
    { id: 'even100', name: 'Even of oneven tot 100', hint: 'Kijk naar het laatste cijfer', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
