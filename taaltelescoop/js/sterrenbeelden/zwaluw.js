import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// Twee rijtjes om te onthouden. Het uw-rijtje: je hoort /uu/, maar je schrijft u
// (duw, schaduw). Het gids-rijtje: denk aan de d (gids, steeds).
const UW = [['d[uw]', '👐'], ['zwal[uw]', '🐦'], ['schad[uw]', '🌳'], ['zen[uw]', '🧠'], ['r[uw]', '🪨'],
  ['sl[uw]', '🦊'], ['waarsch[uw]en', '⚠️'], ['sch[uw]', '🫣']];
const GIDS = [['gi[d]s', '🧭'], ['sin[d]s', '⏳'], ['stee[d]s', '🔁'], ['gin[d]s', '👉'], ['loo[d]s', '🏚️'],
  ['ree[d]s', '✅'], ['fon[d]s', '💰']];

export default {
  intro: 'Twee rijtjes om te onthouden. Het <b>uw-rijtje</b>: je hoort /uu/, maar je schrijft <b>u</b>, zoals in <b>duw</b> en <b>zwaluw</b>. Het <b>gids-rijtje</b>: je hoort een t, maar denk aan de <b>d</b>, zoals in <b>gids</b> en <b>steeds</b>.',
  levels: [
    { id: 'uw', name: 'Het uw-rijtje', hint: 'Duw, schaduw en zwaluw', groups: [5] },
    { id: 'gids', name: 'Het gids-rijtje', hint: 'Gids, sinds en steeds', groups: [5] },
  ],
  makeQuestion(level) {
    if (level === 'uw') return gapQuestion(pick(UW), shuffle(['uw', 'uuw']), 'uw of uuw?');
    return gapQuestion(pick(GIDS), shuffle(['d', 't']), 'd of t?');
  },
};
