import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion } from '../words.js';

// De c kan klinken als een s (centwoord: cent, citroen) of als een k
// (colawoord: cola, camping).
const S = [['[c]ent', '🪙'], ['[c]itroen', '🍋'], ['[c]ircus', '🎪'], ['[c]ijfer', '🔢'], ['[c]el', '🔬'],
  ['de[c]ember', '❄️'], ['re[c]ept', '📜'], ['pre[c]ies', '🎯'], ['pro[c]ent', '💯'], ['medi[c]ijn', '💊'],
  ['[c]entrum', '🏙️']];
const K = [['[c]ola', '🥤'], ['[c]amping', '🏕️'], ['[c]adeau', '🎁'], ['[c]omputer', '💻'], ['[c]lown', '🤡'],
  ['[c]actus', '🌵'], ['[c]acao', '🍫'], ['[c]oncert', '🎵'], ['[c]amera', '📷'], ['[c]ontrole', '✅']];

export default {
  intro: 'Een <b>centwoord</b>: je hoort een s, maar je schrijft een <b>c</b>, zoals in <b>cent</b> en <b>citroen</b>. Een <b>colawoord</b>: je hoort een k, maar je schrijft een <b>c</b>, zoals in <b>cola</b>.',
  levels: [
    { id: 'cent', name: 'Centwoorden', hint: 'c of s? Cent en citroen', groups: [5] },
    { id: 'cola', name: 'Colawoorden', hint: 'c of k? Cola en camping', groups: [5] },
    { id: 'mix', name: 'Door elkaar', hint: 'Cent, cola, circus', groups: [5] },
  ],
  makeQuestion(level) {
    const soundS = level === 'cent' || (level === 'mix' && Math.random() < 0.5);
    return gapQuestion(pick(soundS ? S : K), shuffle(soundS ? ['c', 's'] : ['c', 'k']), 'Welke letter schrijf je?');
  },
};
