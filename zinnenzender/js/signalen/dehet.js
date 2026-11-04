import { pick } from '../../../shared/js/util.js';

// De of het? Dat moet je vaak gewoon onthouden. Verkleinwoorden zijn altijd
// het: het huisje, het katje.
const DE = ['tafel', 'stoel', 'kat', 'hond', 'fiets', 'school', 'deur', 'appel', 'boom', 'juf', 'auto', 'trein', 'bank',
  'maan', 'zon', 'tas', 'jas', 'muis', 'bloem', 'pen'];
const HET = ['huis', 'boek', 'paard', 'konijn', 'raam', 'bed', 'water', 'brood', 'meisje', 'kind', 'vliegtuig', 'feest',
  'ei', 'schaap', 'bos', 'land', 'potlood', 'spel', 'katje', 'huisje'];

export default {
  intro: 'Zet je <b>de</b> of <b>het</b> voor een woord? Dat moet je vaak onthouden: <b>de</b> tafel, <b>het</b> huis. Een tip: een verkleinwoord is altijd <b>het</b>: het tafeltje.',
  levels: [
    { id: 'dehet', name: 'De of het?', hint: 'De tafel, het huis', groups: [5] },
  ],
  makeQuestion() {
    const answer = Math.random() < 0.5 ? 'de' : 'het';
    const word = pick(answer === 'de' ? DE : HET);
    return {
      key: word,
      prompt: 'De of het?',
      answer,
      choices: ['de', 'het'],
      revealText: `Het is ${answer} ${word}.`,
      html: `<p class="signal-word"><span class="gap">?</span> ${word}</p>`,
    };
  },
};
