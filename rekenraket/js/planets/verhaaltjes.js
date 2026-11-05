import { escapeHtml, pick, rand, slot } from '../util.js';

// Verhaaltjessommen. We gebruiken de naam van de speler, zodat het verhaal
// over jou gaat. Elk verhaal heeft een 🔊-knop om het te laten voorlezen.
const STUFF = [
  ['knikkers', '🔵'], ['stickers', '⭐'], ['snoepjes', '🍬'], ['kaarten', '🃏'], ['schelpen', '🐚'], ['stenen', '🪨'],
];
const ANIMALS = [['vogels', '🐦', 'in de boom', 'vliegen er', 'weg'], ['eendjes', '🦆', 'in de vijver', 'zwemmen er', 'weg'],
  ['kikkers', '🐸', 'op het blad', 'springen er', 'weg'], ['vissen', '🐟', 'in de kom', 'zwemmen er', 'naar een andere kom']];

function story(text, answer, emoji, unit) {
  return {
    key: text,
    prompt: 'Lees goed en reken uit.',
    answer,
    maxDigits: 4,
    html: `
      <div class="story">
        <span class="story-emoji" aria-hidden="true">${emoji}</span>
        <p>${escapeHtml(text)}</p>
        <button type="button" class="speak-btn" data-speak="${escapeHtml(text)}" aria-label="Lees voor">🔊</button>
      </div>
      <div class="euro-answer">${slot()}${unit ? `<span class="unit">${unit}</span>` : ''}</div>`,
  };
}

function plus(max, name) {
  const [thing, emoji] = pick(STUFF);
  const a = rand(1, max - 1);
  const b = rand(1, max - a);
  return story(`${name} heeft ${a} ${thing}. ${name} krijgt er ${b} bij. Hoeveel ${thing} heeft ${name} nu?`, a + b, emoji, thing);
}

function minus(max) {
  const [animal, emoji, place, verb, away] = pick(ANIMALS);
  const a = rand(3, max);
  const b = rand(1, a - 1);
  return story(`Er zijn ${a} ${animal} ${place}. Er ${verb} ${b} ${away}. Hoeveel ${animal} zijn er nog ${place}?`, a - b, emoji, animal);
}

// Hoeveel meer: dit vinden veel kinderen lastig, want het is een minsom.
function difference(max, name) {
  const [thing, emoji] = pick(STUFF);
  const friend = pick(['Sam', 'Noor', 'Daan', 'Lotte', 'Finn', 'Yara'].filter((n) => n !== name));
  const a = rand(4, max);
  const b = rand(1, a - 1);
  return story(`${name} heeft ${a} ${thing}. ${friend} heeft er ${b}. Hoeveel ${thing} heeft ${name} meer dan ${friend}?`, a - b, emoji, thing);
}

function groups() {
  const [bag, each] = [rand(2, 6), pick([2, 3, 4, 5, 10])];
  const [thing, emoji] = pick([['snoepjes', '🍬'], ['appels', '🍎'], ['ballonnen', '🎈'], ['potloden', '✏️']]);
  return story(`Er zijn ${bag} zakjes. In elk zakje zitten ${each} ${thing}. Hoeveel ${thing} zijn er samen?`, bag * each, emoji, thing);
}

function money(name) {
  const price = rand(2, 9);
  const count = rand(2, 4);
  return story(`Een ijsje kost €${price}. ${name} koopt er ${count}. Hoeveel euro moet ${name} betalen?`, price * count, '🍦', 'euro');
}

// Verdelen: hoeveel krijgt ieder?
function divide() {
  const kids = rand(2, 6);
  const each = rand(3, 12);
  const [thing, emoji] = pick([['snoepjes', '🍬'], ['stickers', '⭐'], ['knikkers', '🔵'], ['kaarten', '🃏']]);
  return story(`Er zijn ${kids * each} ${thing}. Ze worden eerlijk verdeeld over ${kids} kinderen. Hoeveel ${thing} krijgt ieder kind?`, each, emoji, thing);
}

function bigMoney(name) {
  const price = 5 * rand(3, 40);
  const count = rand(2, 5);
  const [item, emoji] = pick([['kaartje voor de dierentuin', '🦁'], ['boek', '📕'], ['spelletje', '🎲']]);
  return story(`Een ${item} kost €${price}. ${name} koopt er ${count}. Hoeveel euro is dat samen?`, price * count, emoji, 'euro');
}

const LEVELS = {
  tot10: (name) => (Math.random() < 0.5 ? plus(10, name) : minus(10)),
  tot20: (name) => pick([() => plus(20, name), () => minus(20), () => difference(20, name)])(),
  tot100: (name) => pick([() => plus(100, name), () => minus(100), () => difference(100, name), groups, () => money(name)])(),
  tot1000: (name) => pick([() => plus(1000, name), () => difference(1000, name), divide, () => bigMoney(name)])(),
};

export default {
  intro: 'Lees het verhaal goed, of tik op 🔊 om het te laten voorlezen. Vraag jezelf af: komt er iets <b>bij</b> (plus) of gaat er iets <b>af</b> (min)?',
  levels: [
    { id: 'tot10', name: 'Verhaaltjes tot 10', hint: 'Erbij of eraf?', groups: [3] },
    { id: 'tot20', name: 'Verhaaltjes tot 20', hint: 'Ook: hoeveel meer?', groups: [3, 4] },
    { id: 'tot100', name: 'Verhaaltjes tot 100', hint: 'Met zakjes en geld', groups: [4] },
    { id: 'tot1000', name: 'Verhaaltjes tot 1000', hint: 'Plus, min, keer en delen', groups: [5] },
  ],

  makeQuestion(level, profile) {
    return LEVELS[level](profile?.name || 'Sam');
  },
};
