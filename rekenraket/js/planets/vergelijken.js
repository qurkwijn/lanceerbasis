import { pick, rand } from '../util.js';

const THINGS = ['🍎', '⚽', '🐶', '🌟', '🚗', '🧁'];

function groupsQuestion() {
  const left = rand(1, 10);
  const right = Math.random() < 0.2 ? left : rand(1, 10);
  const thing = pick(THINGS);
  const answer = left > right ? 'Links' : left < right ? 'Rechts' : 'Evenveel';
  const pile = (n) => `<div class="compare-pile">${thing.repeat(n)}</div>`;
  return {
    key: `g-${left}-${right}`,
    prompt: 'Waar zijn er meer?',
    answer,
    choices: ['Links', 'Evenveel', 'Rechts'],
    html: `<div class="compare-piles">${pile(left)}<span class="compare-vs">of</span>${pile(right)}</div>`,
  };
}

// Getallen vergelijken met <, > en =, het krokodillenbekje.
function numbersQuestion(max) {
  const a = rand(1, max);
  let b = Math.random() < 0.15 ? a : rand(1, max);
  // Soms de omgedraaide cijfers, zoals 47 en 74: een bekende valkuil.
  if (max > 20 && Math.random() < 0.3 && a % 10 && a > 10) b = (a % 10) * 10 + Math.floor(a / 10);
  const answer = a > b ? '>' : a < b ? '<' : '=';
  return {
    key: `n-${a}-${b}`,
    prompt: 'Welk teken hoort ertussen?',
    answer,
    choices: ['<', '=', '>'],
    html: `<div class="sum"><span>${a}</span><span class="compare-box">?</span><span>${b}</span></div>`,
    onSolved(el) {
      el.querySelector('.compare-box').textContent = answer;
    },
  };
}

const LEVELS = {
  hoeveelheden: groupsQuestion,
  tot20: () => numbersQuestion(20),
  tot100: () => numbersQuestion(100),
};

export default {
  intro: 'Het teken <b>&lt;</b> of <b>&gt;</b> is een hongerige krokodil 🐊: zijn bek gaat altijd open naar het <b>grootste</b> getal.',
  levels: [
    { id: 'hoeveelheden', name: 'Waar zijn er meer?', hint: 'Links, rechts of evenveel', groups: [3] },
    { id: 'tot20', name: 'Getallen tot 20', hint: 'Kies <, > of =', groups: [3, 4] },
    { id: 'tot100', name: 'Getallen tot 100', hint: 'Let op: 47 of 74?', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
