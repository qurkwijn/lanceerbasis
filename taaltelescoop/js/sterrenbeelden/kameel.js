import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// Klankgroepen: hak het woord in stukjes, ka-meel, bo-men.
// Lange klank aan het eind van een klankgroep: één letter (bo-men).
// Korte klank: de medeklinker komt er twee keer (bom-men).
const LANG = [['b[o]men', '🌳'], ['sch[a]pen', '🐑'], ['p[e]ren', '🍐'], ['r[o]zen', '🌹'], ['b[e]ren', '🐻'],
  ['m[a]nen', '🌙'], ['m[u]ren', '🧱'], ['h[a]nen', '🐓'], ['t[o]maat', '🍅'], ['k[a]meel', '🐫'], ['h[a]mer', '🔨'],
  ['l[e]zen', '📖'], ['sl[a]pen', '😴'], ['v[u]ren', '🔥'], ['b[o]ten', '🚤']];
const KORT = [['ki[pp]en', '🐔'], ['po[pp]en', '🪆'], ['be[ll]en', '🔔'], ['ba[ll]en', '⚽'], ['vi[ss]en', '🐟'],
  ['bu[ss]en', '🚌'], ['bo[mm]en', '💣'], ['so[kk]en', '🧦'], ['ki[kk]er', '🐸'], ['we[kk]er', '⏰'],
  ['le[pp]el', '🥄'], ['ka[tt]en', '🐱'], ['po[tt]en', '🪴'], ['zo[nn]en', '☀️'], ['pa[nn]en', '🍳']];

// "o" of "oo" bij een lange klank, "t" of "tt" bij een korte.
function question(entry) {
  const answer = entry[0].match(/\[(\w+)\]/)[1];
  const single = answer[0];
  return gapQuestion(entry, shuffle([single, single + single]), 'Eén letter of twee?');
}

export default {
  intro: 'Hak het woord in klankgroepen: <b>bo-men</b>. Hoor je aan het eind van een klankgroep een lange klank? Dan schrijf je <b>één</b> letter. Een korte klank? Dan komt de medeklinker er <b>twee keer</b>: <b>bom-men</b>.',
  levels: [
    { id: 'lang', name: 'Lange klank', hint: 'Bomen, schapen en peren', groups: [4] },
    { id: 'kort', name: 'Korte klank', hint: 'Kippen, bellen en poppen', groups: [4] },
    { id: 'mix', name: 'Door elkaar', hint: 'Bomen of bommen?', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'lang') return question(pick(LANG));
    if (level === 'kort') return question(pick(KORT));
    return question(pick(Math.random() < 0.5 ? LANG : KORT));
  },
};
