import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// Politiewoorden: je hoort /tsie/, maar je schrijft tie.
// Tropisch-woorden: je hoort /ies/, maar je schrijft isch.
const TIE = [['poli[tie]', '👮'], ['vakan[tie]', '🏖️'], ['informa[tie]', 'ℹ️'], ['ac[tie]', '🎬'], ['por[tie]', '🍟'],
  ['opera[tie]', '🏥'], ['ambi[tie]', '🎯'], ['tradi[tie]', '🎄'], ['reac[tie]', '💬']];
const ISCH = [['trop[isch]', '🌴'], ['log[isch]', '🧠'], ['elektr[isch]', '⚡'], ['prakt[isch]', '🛠️'],
  ['fantast[isch]', '🤩'], ['techn[isch]', '⚙️'],
  ['magnet[isch]', '🧲']];

const WRONG = { tie: 'tsie', isch: 'ies' };

export default {
  intro: 'Een <b>politiewoord</b>: je hoort /tsie/, maar je schrijft <b>tie</b>. Een <b>tropisch-woord</b>: je hoort /ies/, maar je schrijft <b>isch</b>.',
  levels: [
    { id: 'tie', name: 'Politiewoorden', hint: 'Politie en vakantie', groups: [5] },
    { id: 'isch', name: 'Tropisch-woorden', hint: 'Tropisch en logisch', groups: [5] },
    { id: 'mix', name: 'Door elkaar', hint: 'Actie en elektrisch', groups: [5] },
  ],
  makeQuestion(level) {
    const kind = level === 'mix' ? pick(['tie', 'isch']) : level;
    return gapQuestion(pick(kind === 'tie' ? TIE : ISCH), shuffle([kind, WRONG[kind]]), 'Hoe schrijf je het?');
  },
};
