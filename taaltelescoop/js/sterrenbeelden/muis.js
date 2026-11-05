import { pick } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// Verkleinwoorden: meestal -je (huisje). Na een lange klank of een l, n of r
// vaak -tje (stoeltje). Na een m met een lange klank -pje (boompje). Na een
// korte klank met l, m, n, r of ng -etje (ringetje), en dan dubbel: balletje.
const JE = [['huis[je]', '🏠'], ['boek[je]', '📕'], ['kat[je]', '🐱'], ['hond[je]', '🐶'], ['vis[je]', '🐟'],
  ['boot[je]', '🚤'], ['kop[je]', '☕'], ['bed[je]', '🛏️'], ['muis[je]', '🐭'], ['sok[je]', '🧦'], ['eend[je]', '🦆']];
const TJE = [['stoel[tje]', '🪑'], ['schoen[tje]', '👟'], ['deur[tje]', '🚪'], ['trein[tje]', '🚆'], ['uil[tje]', '🦉'],
  ['maan[tje]', '🌙'], ['vogel[tje]', '🐦'], ['ei[tje]', '🥚'], ['koe[tje]', '🐄']];
const PJE = [['boom[pje]', '🌳'], ['raam[pje]', '🪟'], ['duim[pje]', '👍'], ['bezem[pje]', '🧹'], ['film[pje]', '🎬'],
  ['arm[pje]', '💪']];
const ETJE = [['ring[etje]', '💍'], ['ding[etje]', '🧸'], ['slang[etje]', '🐍'], ['ball[etje]', '⚽'], ['bell[etje]', '🔔'],
  ['mann[etje]', '👨'], ['sterr[etje]', '⭐'], ['kamm[etje]', '🪮'], ['pann[etje]', '🍳'], ['tong[etje]', '👅']];

const PROMPT = 'Maak het klein!';

export default {
  intro: 'Iets kleins maak je met <b>-je</b>: een <b>huisje</b>. Soms is het <b>-tje</b> (stoeltje), <b>-pje</b> (boompje) of <b>-etje</b> (ringetje). Zeg het hardop, dan hoor je het!',
  levels: [
    { id: 'jetje', name: '-je of -tje', hint: 'Huisje en stoeltje', groups: [4] },
    { id: 'alle', name: 'Alle vier', hint: 'Ook boompje en ringetje', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'jetje') return gapQuestion(pick(Math.random() < 0.5 ? JE : TJE), ['je', 'tje'], PROMPT);
    return gapQuestion(pick(pick([JE, TJE, PJE, ETJE])), ['je', 'tje', 'pje', 'etje'], PROMPT);
  },
};
