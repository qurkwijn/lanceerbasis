import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// aai, ooi en oei: je hoort een j, maar je schrijft een i.
// eeuw en ieuw: je hoort een w, maar denk aan de u.
const AAI = [['h[aai]', '🦈'], ['kr[aai]', '🐦‍⬛'], ['zw[aai]en', '👋'], ['dr[aai]en', '🔄'], ['m[aai]en', '🚜'],
  ['h[ooi]', '🌾'], ['k[ooi]', '🐹'], ['m[ooi]', '✨'], ['g[ooi]en', '🤾'], ['k[oei]', '🐄'], ['gr[oei]en', '🌱'],
  ['bl[oei]en', '🌸'], ['spr[oei]en', '💦'], ['r[oei]en', '🚣'], ['b[oei]', '🛟']];
const EEUW = [['l[eeuw]', '🦁'], ['m[eeuw]', '🐦'], ['sn[eeuw]', '❄️'], ['n[ieuw]', '🆕'], ['n[ieuw]s', '📰'],
  ['[eeuw]', '⏳'], ['schr[eeuw]en', '😱'], ['g[eeuw]en', '🥱'], ['k[ieuw]', '🐟'], ['[eeuw]ig', '♾️'], ['n[ieuw]sgierig', '🧐']];

// De goede schrijfwijze en hoe je hem zou schrijven als je alleen luistert.
const WRONG = { aai: 'aaj', ooi: 'ooj', oei: 'oej', eeuw: 'eew', ieuw: 'iew' };

function question(entry) {
  const sound = entry[0].match(/\[(\w+)\]/)[1];
  return gapQuestion(entry, shuffle([sound, WRONG[sound]]), 'Hoe schrijf je het?');
}

export default {
  intro: 'Bij <b>haai</b>, <b>mooi</b> en <b>koei</b> hoor je een j, maar je schrijft een <b>i</b>. Bij <b>leeuw</b> en <b>nieuw</b> moet je aan de <b>u</b> denken!',
  levels: [
    { id: 'aai', name: 'aai, ooi en oei', hint: 'Haai, hooi en koei', groups: [4] },
    { id: 'eeuw', name: 'eeuw en ieuw', hint: 'Leeuw, sneeuw en nieuw', groups: [4] },
  ],
  makeQuestion(level) {
    return question(pick(level === 'aai' ? AAI : EEUW));
  },
};
