import { pick, rand, slot } from '../util.js';

// Een som als "8 + 5 = ?". Met hide = 'b' wordt het een aanvulsom: "8 + ? = 13".
function sum(a, op, b, hide = 'answer') {
  const parts = { a, b, answer: op === '+' ? a + b : a - b };
  const cell = (k) => (hide === k ? slot() : `<span>${parts[k]}</span>`);
  return {
    key: `${a}${op}${b}${hide}`,
    prompt: hide === 'answer' ? 'Reken uit' : 'Welk getal ontbreekt?',
    answer: parts[hide],
    maxDigits: 3,
    html: `
      <div class="sum">
        ${cell('a')}<span class="op">${op === '+' ? '+' : '−'}</span>${cell('b')}
        <span class="op">=</span>${cell('answer')}
      </div>`,
  };
}

const LEVELS = {
  plus10() {
    const a = rand(1, 9);
    return sum(a, '+', rand(1, 10 - a));
  },
  min10() {
    const a = rand(2, 10);
    return sum(a, '-', rand(1, a));
  },
  // Tot 20 zonder over de 10 heen te gaan: 12 + 5, 17 - 4.
  tot20() {
    if (Math.random() < 0.5) {
      const a = rand(11, 18);
      return sum(a, '+', rand(1, 19 - a));
    }
    const a = rand(12, 19);
    return sum(a, '-', rand(1, a - 10));
  },
  // Over de 10 heen: 8 + 5, 13 - 6. Soms als aanvulsom.
  over10() {
    const hide = Math.random() < 0.25 ? 'b' : 'answer';
    if (Math.random() < 0.5) {
      const a = rand(2, 9);
      return sum(a, '+', rand(Math.max(2, 11 - a), 9), hide);
    }
    const a = rand(11, 18);
    return sum(a, '-', rand(a - 9, 9), hide);
  },
  tientallen() {
    const a = 10 * rand(1, 9);
    return Math.random() < 0.5
      ? sum(a, '+', 10 * rand(1, 10 - a / 10))
      : sum(a, '-', 10 * rand(1, a / 10));
  },
  tot100() {
    const a = rand(11, 89);
    const kind = pick(['plus1', 'min1', 'plus10', 'min10']);
    if (kind === 'plus1') return sum(a, '+', rand(1, Math.min(9, 100 - a)));
    if (kind === 'min1') return sum(a, '-', rand(1, 9));
    if (kind === 'plus10') return sum(a, '+', 10 * rand(1, Math.floor((100 - a) / 10) || 1));
    return sum(a, '-', 10 * rand(1, Math.floor(a / 10)));
  },
};

export default {
  intro: 'Bij <b>plus</b> komt er iets bij, bij <b>min</b> gaat er iets af. Tip: tel verder vanaf het grootste getal.',
  levels: [
    { id: 'plus10', name: 'Plus tot 10', hint: 'Zoals 4 + 3', groups: [3] },
    { id: 'min10', name: 'Min tot 10', hint: 'Zoals 9 − 5', groups: [3] },
    { id: 'tot20', name: 'Tot 20', hint: 'Zoals 12 + 5 en 17 − 4', groups: [3, 4] },
    { id: 'over10', name: 'Over de 10', hint: 'Zoals 8 + 5 en 13 − 6', groups: [4] },
    { id: 'tientallen', name: 'Tientallen', hint: 'Zoals 30 + 40 en 90 − 20', groups: [4] },
    { id: 'tot100', name: 'Tot 100', hint: 'Zoals 34 + 5 en 56 − 20', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
