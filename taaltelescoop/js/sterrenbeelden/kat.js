import { pick, shuffle } from '../../../shared/js/util.js';

// Hakken en plakken: het woord in losse klanken, door elkaar. Tik ze in de
// goede volgorde. Een klank als "aa" of "sch" is één blokje, zoals op school.
const KORT = [['k a t', '🐱'], ['v i s', '🐟'], ['b u s', '🚌'], ['p e n', '🖊️'], ['b e d', '🛏️'],
  ['s o k', '🧦'], ['m aa n', '🌙'], ['b oo m', '🌳'], ['r oo s', '🌹'], ['v uu r', '🔥'], ['m ui s', '🐭'],
  ['h ui s', '🏠'], ['k oe', '🐄'], ['v oe t', '🦶'], ['k aa s', '🧀'], ['p ee r', '🍐'], ['b ee n', '🦵'],
  ['z o n', '☀️'], ['p e t', '🧢'], ['j a s', '🧥'], ['k i p', '🐔'], ['n eu s', '👃'], ['b oo t', '🚤'],
  ['g ei t', '🐐'], ['r aa m', '🪟'], ['m e s', '🔪'], ['b a l', '⚽'], ['d ui m', '👍']];

const LANG = [['s t oe l', '🪑'], ['k a s t', '🗄️'], ['s p i n', '🕷️'], ['t e n t', '⛺'], ['b l oe m', '🌸'],
  ['s l a k', '🐌'], ['k r a b', '🦀'], ['v l a g', '🚩'], ['b r i l', '👓'], ['s t e r', '⭐'], ['w o l k', '☁️'],
  ['sch aa p', '🐑'], ['sch oe n', '👟'], ['sch ee p', '🚢'], ['l a m p', '💡'], ['v o r k', '🍴'], ['p o s t', '📮'],
  ['f r ui t', '🍇'], ['t r o m', '🥁'], ['k l o k', '🕰️'], ['s l ee', '🛷'], ['b l i k', '🥫']];

const MOEILIJK = [['s t r i k', '🎀'], ['m e l k', '🥛'], ['h e r f s t', '🍂'], ['s t e r k', '💪'], ['h e l m', '⛑️'],
  ['w o r m', '🪱'], ['b o r s t e l', '🪥'], ['s t r oo m', '⚡'], ['b l i k s e m', '🌩️'], ['m a r k t', '🛒'],
  ['f l e s', '🍾'], ['k o m p a s', '🧭'], ['s n oe p', '🍬'], ['p a r k', '🏞️'], ['w a l v i s', '🐋'],
  ['k e r s t b oo m', '🎄'], ['k r a n t', '📰'], ['s t r oo', '🌾'], ['k r ui s', '❌'], ['k l a s', '🏫']];

const LIST = { kort: KORT, lang: LANG, moeilijk: MOEILIJK };

function scramble(parts) {
  for (let i = 0; i < 10; i++) {
    const tiles = shuffle(parts);
    if (tiles.join(' ') !== parts.join(' ')) return tiles;
  }
  return [...parts].reverse();
}

export default {
  intro: 'Een woord bestaat uit klanken. <b>k - a - t</b> is <b>kat</b>! Tik de klanken in de goede volgorde. Let op: <b>aa</b>, <b>oe</b> en <b>sch</b> zijn één klank.',
  levels: [
    { id: 'kort', name: 'Korte woorden', hint: 'Kat, maan en huis', groups: [3] },
    { id: 'lang', name: 'Langere woorden', hint: 'Stoel, bloem en schaap', groups: [3, 4] },
    { id: 'moeilijk', name: 'Moeilijke hakwoorden', hint: 'Strik, melk en herfst', groups: [4] },
  ],
  makeQuestion(level) {
    const [klanken, pic] = pick(LIST[level]);
    const word = klanken.replace(/ /g, '');
    return {
      key: word,
      prompt: 'Hak en plak: maak het woord!',
      answer: klanken,
      tiles: scramble(klanken.split(' ')),
      revealText: `Zo schrijf je ${word}.`,
      html: `
        <div class="word-card">
          <span class="word-pic" aria-hidden="true">${pic}</span>
          <button type="button" class="speak-word" data-speak="${word}" aria-label="Lees het woord voor">🔊</button>
        </div>`,
    };
  },
};
