import { pick, rand, slot } from '../util.js';

// Plus en min tot 1000: eerst met ronde getallen, dan zonder en met
// overschrijding. Splits in honderdtallen, tientallen en eenheden.
function sum(a, op, b) {
  return {
    key: `${a}${op}${b}`,
    prompt: 'Reken uit',
    answer: op === '+' ? a + b : a - b,
    maxDigits: 4,
    html: `<div class="sum"><span>${a}</span><span class="op">${op === '+' ? '+' : '−'}</span><span>${b}</span><span class="op">=</span>${slot()}</div>`,
  };
}

const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
const noCarry = (a, b) => digits(a).every((d, i) => d + digits(b)[i] <= 9);
const noBorrow = (a, b) => digits(a).every((d, i) => d >= digits(b)[i]);

const LEVELS = {
  // 300 + 400, 250 + 30, 800 − 300
  rond() {
    if (Math.random() < 0.5) {
      const a = 100 * rand(1, 8);
      return Math.random() < 0.5 ? sum(a, '+', 100 * rand(1, 9 - a / 100)) : sum(a + 100, '-', 100 * rand(1, a / 100));
    }
    const a = 10 * rand(11, 89);
    return Math.random() < 0.5 ? sum(a, '+', 10 * rand(1, 9)) : sum(a, '-', 10 * rand(1, 9));
  },
  // 345 + 23 en 468 − 125, zonder over een tiental of honderdtal te gaan
  zonder() {
    const plus = Math.random() < 0.5;
    let a;
    let b;
    do {
      a = rand(120, plus ? 880 : 980);
      b = rand(11, plus ? 999 - a : a - 1);
    } while (plus ? !noCarry(a, b) : !noBorrow(a, b));
    return sum(a, plus ? '+' : '-', b);
  },
  // 378 + 45 en 432 − 57: over het tiental of honderdtal heen
  met() {
    const plus = Math.random() < 0.5;
    let a;
    let b;
    do {
      a = rand(120, 950);
      b = rand(11, Math.min(250, plus ? 999 - a : a - 1));
    } while (plus ? noCarry(a, b) : noBorrow(a, b));
    return sum(a, plus ? '+' : '-', b);
  },
};

export default {
  intro: 'Bij grote getallen helpt het om te <b>splitsen</b>: 345 + 23 is 345 + 20 = 365, en dan + 3 = 368. Of reken eerst de honderdtallen, dan de tientallen en dan de eenheden.',
  levels: [
    { id: 'rond', name: 'Ronde getallen', hint: '300 + 400 en 250 + 30', groups: [5] },
    { id: 'zonder', name: 'Tot 1000', hint: '345 + 23 en 468 − 125', groups: [5] },
    { id: 'met', name: 'Over het tiental', hint: '378 + 45 en 432 − 57', groups: [5] },
  ],
  makeQuestion(level) {
    return LEVELS[level]();
  },
};
