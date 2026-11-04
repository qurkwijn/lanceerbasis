import { pick, shuffle } from '../../../shared/js/util.js';

// Klanken horen, de basis van leren lezen in groep 3. Wat hoor je vooraan, in
// het midden of achteraan? Een klank als "aa", "ui" of "sch" telt als één.
const WOORDEN = [['k a t', '🐱'], ['v i s', '🐟'], ['b u s', '🚌'], ['p e n', '🖊️'], ['b e d', '🛏️'], ['s o k', '🧦'],
  ['m aa n', '🌙'], ['b oo m', '🌳'], ['r oo s', '🌹'], ['v uu r', '🔥'], ['m ui s', '🐭'], ['h ui s', '🏠'],
  ['v oe t', '🦶'], ['k aa s', '🧀'], ['p ee r', '🍐'], ['z o n', '☀️'], ['j a s', '🧥'], ['k i p', '🐔'],
  ['n eu s', '👃'], ['b oo t', '🚤'], ['g ei t', '🐐'], ['r aa m', '🪟'], ['m e s', '🔪'], ['b a l', '⚽'],
  ['d ui m', '👍'], ['sch aa p', '🐑'], ['sch oe n', '👟'], ['l a m p', '💡'], ['w o l k', '☁️'], ['t e n t', '⛺'],
  ['ij s', '🍦'], ['ui l', '🦉'], ['aa p', '🐒'], ['oo r', '👂'], ['ei', '🥚'], ['h o n d', '🐶'], ['f ie t s', '🚲']];

const KLANKEN = ['a', 'aa', 'b', 'd', 'e', 'ee', 'eu', 'ei', 'f', 'g', 'h', 'i', 'ie', 'ij', 'j', 'k', 'l', 'm', 'n',
  'o', 'oo', 'oe', 'p', 'r', 's', 'sch', 't', 'u', 'uu', 'ui', 'v', 'w', 'z'];

// Een klinker en zijn lange of korte broertje lijken op elkaar: die komen
// vaker als foute keuze, zodat je echt goed moet luisteren.
const BROERTJE = { a: 'aa', aa: 'a', o: 'oo', oo: 'o', e: 'ee', ee: 'e', u: 'uu', uu: 'u', i: 'ie', ie: 'i', ui: 'u', eu: 'u', ei: 'ij', ij: 'ei', oe: 'oo' };

const WHERE = {
  begin: ['Wat hoor je vooraan?', (k) => k[0]],
  midden: ['Wat hoor je in het midden?', (k) => k[1]],
  eind: ['Wat hoor je achteraan?', (k) => k[k.length - 1]],
};

function question(level) {
  const [prompt, find] = WHERE[level];
  const list = level === 'midden' ? WOORDEN.filter(([k]) => k.split(' ').length === 3) : WOORDEN;
  const [klanken, pic] = pick(list);
  const parts = klanken.split(' ');
  const answer = find(parts);
  const word = parts.join('');
  const near = BROERTJE[answer];
  const others = shuffle(KLANKEN.filter((k) => k !== answer && k !== near && !parts.includes(k)));
  const wrong = near && !parts.includes(near) ? [near, others[0]] : others.slice(0, 2);
  return {
    key: `${level}-${word}`,
    prompt,
    answer,
    choices: shuffle([answer, ...wrong]),
    revealText: `In ${word} hoor je ${parts.join(' - ')}.`,
    html: `
      <div class="sound-card">
        <span class="sound-pic" aria-hidden="true">${pic}</span>
        <button type="button" class="speak-word" data-speak="${word}" aria-label="Lees het woord voor">🔊</button>
      </div>`,
  };
}

export default {
  intro: 'Kijk naar het plaatje en zeg het woord langzaam: <b>m - aa - n</b>. Welke klank hoor je? Tik op 🔊 als je het woord wilt horen.',
  levels: [
    { id: 'begin', name: 'Vooraan', hint: 'Maan begint met m', groups: [3] },
    { id: 'midden', name: 'In het midden', hint: 'Kat of kaat?', groups: [3] },
    { id: 'eind', name: 'Achteraan', hint: 'Vis eindigt met s', groups: [3] },
  ],
  makeQuestion: question,
};
