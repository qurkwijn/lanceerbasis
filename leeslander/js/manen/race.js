import { pick, shuffle } from '../../../shared/js/util.js';
import { KORT, LANG, distractors } from './flits.js';

// Snel lezen: een minuut lang woorden lezen en het goede plaatje kiezen. Zo
// oefen je je leestempo, net als bij de woordrijtjes op school.
const LIST = { kort: KORT, lang: LANG };

function question(level) {
  const list = LIST[level];
  const entry = pick(list);
  const [word, pic] = entry;
  return {
    key: word,
    prompt: 'Lees en tik!',
    answer: pic,
    choices: shuffle([pic, ...distractors(list, entry)]),
    choiceStyle: 'big',
    revealText: `Er stond ${word}.`,
    html: `<div class="flash-card"><span class="flash-word">${word}</span></div>`,
  };
}

export default {
  intro: 'Je hebt <b>1 minuut</b>. Lees het woord en tik zo snel als je kunt op het goede plaatje. Hoeveel haal jij?',
  levels: [
    { id: 'kort', name: 'Korte woorden', hint: 'Race tegen de klok', groups: [3, 4], timed: 60, starsAt: [8, 14] },
    { id: 'lang', name: 'Lange woorden', hint: 'Race tegen de klok', groups: [4, 5], timed: 60, starsAt: [8, 14] },
  ],
  makeQuestion: question,
};
