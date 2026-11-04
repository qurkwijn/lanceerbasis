import { pick } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// Korte en lange klanken: man of maan, bom of boom. De keuzes horen bij de
// klinker in het woord.
const PIC = [['m[aa]n', '🌙'], ['m[a]n', '👨'], ['r[aa]m', '🪟'], ['b[oo]m', '🌳'], ['b[o]m', '💣'],
  ['v[uu]r', '🔥'], ['m[uu]r', '🧱'], ['k[a]t', '🐱'], ['b[a]l', '⚽'], ['p[e]n', '🖊️'], ['b[ee]n', '🦵'],
  ['sch[aa]p', '🐑'], ['h[aa]n', '🐓'], ['r[oo]s', '🌹'], ['z[o]n', '☀️'], ['b[u]s', '🚌'], ['p[e]t', '🧢'],
  ['k[aa]s', '🧀'], ['p[ee]r', '🍐'], ['z[ee]', '🌊']];
const WORDS = ['m[aa]n', 'm[a]n', 'r[a]m', 'r[aa]m', 'k[aa]l', 'k[a]m', 't[a]k', 't[aa]k', 'z[o]n', 'z[oo]n',
  'b[o]m', 'b[oo]m', 'r[o]k', 'r[oo]k', 'v[e]l', 'v[ee]l', 'b[e]d', 'b[ee]n', 'd[u]n', 'd[uu]r', 'm[u]s', 'm[uu]r'];

const PAIRS = { a: ['a', 'aa'], o: ['o', 'oo'], e: ['e', 'ee'], u: ['u', 'uu'] };

function question(entry) {
  const vowel = entry[0].match(/\[(\w)/)[1];
  return gapQuestion(entry, PAIRS[vowel], 'Kort of lang?');
}

export default {
  intro: 'Hoor je een korte klank, zoals in <b>man</b>? Dan schrijf je één letter. Een lange klank, zoals in <b>maan</b>? Dan schrijf je er twee.',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Maan, man, boom en bom', groups: [3, 4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Tak, taak, zon en zoon', groups: [3, 4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return question(pick(PIC));
    return question([pick(WORDS)]);
  },
};
