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
  helft() {
    const n = 2 * rand(1, 25);
    return {
      key: `h-${n}`,
      prompt: 'Wat is de helft?',
      answer: n / 2,
      html: `<div class="sum"><span class="half-label">de helft van</span><span>${n}</span><span class="op">=</span>${slot()}</div>`,
    };
  },
};

export default {
  intro: 'Dubbelen zijn sommen met twee keer hetzelfde getal, zoals 4 + 4. Weet je die? Dan is <b>4 + 5</b> makkelijk: dat is 4 + 4 en nog 1.',
  levels: [
    { id: 'dubbel10', name: 'Dubbelen tot 10 + 10', hint: 'Zoals 6 + 6', groups: [3, 4] },
    { id: 'bijna', name: 'Bijna dubbel', hint: 'Zoals 6 + 7', groups: [3, 4] },
    { id: 'dubbel50', name: 'Grote dubbelen', hint: 'Zoals 15 + 15 en 30 + 30', groups: [4] },
    { id: 'helft', name: 'De helft', hint: 'De helft van 16 is…', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
