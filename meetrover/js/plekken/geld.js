import { pick, rand, slot } from '../util.js';

// Eenvoudige tekeningen van euromunten en briefjes (geen echte ontwerpen).
const BILL_COLORS = { 5: '#9aa3ad', 10: '#e2675d', 20: '#5b8fd6', 50: '#f0a145' };

function coin(value) {
  const [outer, inner] = value === 2 ? ['#d9dde3', '#e8b84a'] : ['#e8b84a', '#d9dde3'];
  return `
    <svg class="coin" viewBox="0 0 60 60" role="img" aria-label="${value} euro">
      <circle cx="30" cy="30" r="28" fill="${outer}" stroke="rgba(0,0,0,.25)" stroke-width="2" />
      <circle cx="30" cy="30" r="19" fill="${inner}" />
      <text x="30" y="31">${value}€</text>
    </svg>`;
}

function bill(value) {
  return `
    <svg class="bill" viewBox="0 0 110 58" role="img" aria-label="briefje van ${value} euro">
      <rect x="1" y="1" width="108" height="56" rx="6" fill="${BILL_COLORS[value]}" stroke="rgba(0,0,0,.25)" stroke-width="2" />
      <rect x="8" y="8" width="94" height="42" rx="4" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" />
      <text x="55" y="30">€${value}</text>
    </svg>`;
}

// Koperen munten van 5 cent, gouden van 10, 20 en 50 cent.
function centCoin(cents) {
  const fill = cents === 5 ? '#c9774a' : '#e8b84a';
  const r = { 5: 22, 10: 22, 20: 25, 50: 28 }[cents];
  return `
    <svg class="coin" viewBox="0 0 60 60" role="img" aria-label="${cents} cent">
      <circle cx="30" cy="30" r="${r}" fill="${fill}" stroke="rgba(0,0,0,.25)" stroke-width="2" />
      <text x="30" y="31">${cents}c</text>
    </svg>`;
}

const money = (value) => (value <= 2 ? coin(value) : bill(value));

const euro = `<div class="euro-answer"><span>€</span>${slot()}</div>`;

// Een stapel geld, van groot naar klein, zoals je ook telt.
function countQuestion(kinds, max, minPieces, maxPieces) {
  const pieces = [];
  const count = rand(minPieces, maxPieces);
  while (pieces.length < count) {
    const total = pieces.reduce((s, n) => s + n, 0);
    const fits = kinds.filter((k) => total + k <= max);
    if (!fits.length) break;
    pieces.push(pick(fits));
  }
  pieces.sort((a, b) => b - a);
  const total = pieces.reduce((s, n) => s + n, 0);
  return {
    key: `tel-${pieces.join('-')}`,
    prompt: 'Hoeveel geld is dit?',
    answer: total,
    maxDigits: 3,
    html: `<div class="money">${pieces.map(money).join('')}</div>${euro}`,
  };
}

// Centen tellen tot 100 cent, oftewel 1 euro.
function centQuestion() {
  const pieces = [];
  const count = rand(2, 5);
  while (pieces.length < count) {
    const total = pieces.reduce((s, n) => s + n, 0);
    const fits = [5, 10, 20, 50].filter((k) => total + k <= 100);
    if (!fits.length) break;
    pieces.push(pick(fits));
  }
  pieces.sort((a, b) => b - a);
  const total = pieces.reduce((s, n) => s + n, 0);
  return {
    key: `cent-${pieces.join('-')}`,
    prompt: 'Hoeveel cent is dit?',
    answer: total,
    maxDigits: 3,
    revealText: total === 100 ? 'Het is 100 cent. Dat is precies 1 euro!' : `Het is ${total} cent.`,
    html: `<div class="money">${pieces.map(centCoin).join('')}</div><div class="euro-answer">${slot()}<span class="unit">cent</span></div>`,
  };
}

const ITEMS = ['🍎', '🧸', '⚽', '📚', '🖍️', '🧃', '🍦', '🎈', '🪁', '🧩', '🍌', '🚗'];
const priceTag = (item, price) =>
  `<div class="shop-item"><span class="shop-emoji" aria-hidden="true">${item}</span><span class="price-tag">€${price}</span></div>`;

function shopQuestion(maxTotal, maxPrice) {
  const a = rand(1, maxPrice);
  const b = rand(1, Math.min(maxPrice, maxTotal - a));
  const itemA = pick(ITEMS);
  const itemB = pick(ITEMS.filter((i) => i !== itemA));
  return {
    key: `winkel-${a}-${b}`,
    prompt: 'Hoeveel kost het samen?',
    answer: a + b,
    maxDigits: 3,
    html: `<div class="shop">${priceTag(itemA, a)}<span class="op">+</span>${priceTag(itemB, b)}</div>${euro}`,
  };
}

function changeQuestion() {
  const paid = pick([10, 20, 20, 50]);
  const price = rand(paid === 50 ? 21 : 1, paid - 1);
  return {
    key: `terug-${paid}-${price}`,
    prompt: `Je betaalt met €${paid}. Hoeveel krijg je terug?`,
    answer: paid - price,
    maxDigits: 3,
    html: `<div class="shop">${priceTag(pick(ITEMS), price)}<span class="op pay-arrow">←</span>${bill(paid)}</div>${euro}`,
  };
}

const LEVELS = {
  munten10: () => countQuestion([1, 2], 10, 2, 5),
  tot20: () => countQuestion([1, 2, 5, 10], 20, 2, 5),
  winkel10: () => shopQuestion(10, 6),
  tot100: () => countQuestion([1, 2, 5, 10, 20, 50], 100, 3, 6),
  winkel100: () => shopQuestion(100, 50),
  terug: () => changeQuestion(),
  centen: () => centQuestion(),
};

export default {
  intro: 'Tel het geld van groot naar klein: eerst de briefjes, dan de munten. Een munt van <b>2 euro</b> is net zoveel als twee munten van 1 euro.',
  levels: [
    { id: 'munten10', name: 'Munten tot €10', hint: 'Munten van 1 en 2 euro', groups: [3] },
    { id: 'tot20', name: 'Geld tot €20', hint: 'Munten en briefjes van 5 en 10', groups: [3, 4] },
    { id: 'winkel10', name: 'Winkeltje tot €10', hint: 'Hoeveel kost het samen?', groups: [3] },
    { id: 'tot100', name: 'Geld tot €100', hint: 'Ook briefjes van 20 en 50', groups: [4] },
    { id: 'winkel100', name: 'Winkeltje tot €100', hint: 'Hoeveel kost het samen?', groups: [4] },
    { id: 'terug', name: 'Wisselgeld', hint: 'Hoeveel krijg je terug?', groups: [4] },
    { id: 'centen', name: 'Centen', hint: '100 cent is 1 euro', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
