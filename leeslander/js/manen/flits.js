import { pick, shuffle } from '../../../shared/js/util.js';

// Een woord flitst kort in beeld. Daarna kies je het plaatje dat erbij hoort.
// Plaatjes die met dezelfde letter beginnen komen vaker als foute keuze, zodat
// je het hele woord moet lezen en niet alleen de eerste letter.
export const KORT = [['kat', '🐱'], ['vis', '🐟'], ['bus', '🚌'], ['pen', '🖊️'], ['bal', '⚽'], ['zon', '☀️'],
  ['bom', '💣'], ['sok', '🧦'], ['pet', '🧢'], ['jas', '🧥'], ['mes', '🔪'], ['bed', '🛏️'], ['kip', '🐔'],
  ['koe', '🐄'], ['aap', '🐒'], ['uil', '🦉'], ['mug', '🦟'], ['ijs', '🍦'], ['oor', '👂'], ['neus', '👃'],
  ['voet', '🦶'], ['maan', '🌙'], ['boom', '🌳'], ['roos', '🌹'], ['vuur', '🔥'], ['kaas', '🧀'], ['peer', '🍐'],
  ['huis', '🏠'], ['muis', '🐭'], ['hond', '🐶'], ['geit', '🐐'], ['boot', '🚤'], ['been', '🦵'], ['mond', '👄']];

export const LANG = [['fiets', '🚲'], ['trein', '🚆'], ['banaan', '🍌'], ['appel', '🍎'], ['olifant', '🐘'], ['giraf', '🦒'],
  ['slang', '🐍'], ['slak', '🐌'], ['sleutel', '🔑'], ['kikker', '🐸'], ['konijn', '🐰'], ['kasteel', '🏰'],
  ['kaars', '🕯️'], ['krab', '🦀'], ['krokodil', '🐊'], ['vlinder', '🦋'], ['vlag', '🚩'], ['vliegtuig', '✈️'],
  ['tomaat', '🍅'], ['taart', '🎂'], ['tent', '⛺'], ['tractor', '🚜'], ['wortel', '🥕'], ['wolk', '☁️'],
  ['paraplu', '☂️'], ['paard', '🐴'], ['pinguïn', '🐧'], ['pizza', '🍕'], ['bril', '👓'], ['brood', '🍞'],
  ['bloem', '🌸'], ['ballon', '🎈'], ['schoen', '👟'], ['schaap', '🐑'], ['schildpad', '🐢'], ['raket', '🚀'],
  ['regenboog', '🌈'], ['gitaar', '🎸'], ['druiven', '🍇'], ['aardbei', '🍓'], ['citroen', '🍋'], ['cadeau', '🎁']];

const LIST = { kort: KORT, lang: LANG };
const TIME = { kort: 1800, lang: 1200 };

export function distractors(list, [word, pic]) {
  const others = list.filter(([w, p]) => w !== word && p !== pic);
  const alike = shuffle(others.filter(([w]) => w[0] === word[0]));
  const rest = shuffle(others.filter(([w]) => w[0] !== word[0]));
  return [...alike.slice(0, 1), ...rest].slice(0, 2).map(([, p]) => p);
}

function question(level) {
  const list = LIST[level];
  const entry = pick(list);
  const [word, pic] = entry;
  const time = TIME[level];
  let flash;
  return {
    key: word,
    prompt: 'Lees het woord!',
    answer: pic,
    choices: shuffle([pic, ...distractors(list, entry)]),
    choiceStyle: 'big',
    choicesDelay: time,
    revealText: `Er stond ${word}.`,
    html: `<div class="flash-card"><span class="flash-word">${word}</span></div>`,
    // Het woord verdwijnt na een tijdje.
    onShow(el) {
      const w = el.querySelector('.flash-word');
      flash = setTimeout(() => w.classList.add('gone'), time);
      return () => clearTimeout(flash);
    },
    // Na een fout flitst het woord nog een keer.
    onRetry(el) {
      const w = el.querySelector('.flash-word');
      w.classList.remove('gone');
      clearTimeout(flash);
      flash = setTimeout(() => w.classList.add('gone'), time);
    },
    onSolved(el) {
      clearTimeout(flash);
      const w = el.querySelector('.flash-word');
      w.classList.remove('gone');
      w.classList.add('solved');
    },
  };
}

export default {
  intro: 'Een woord flitst even in beeld en is dan weg. Lees het snel en kies het goede plaatje!',
  levels: [
    { id: 'kort', name: 'Korte woorden', hint: 'Kat, vis, maan en huis', groups: [3, 4] },
    { id: 'lang', name: 'Lange woorden', hint: 'Fiets, kikker en vlinder, en sneller!', groups: [4, 5] },
  ],
  makeQuestion: question,
};
