import { pick, rand, shuffle } from '../util.js';

const DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli',
  'augustus', 'september', 'oktober', 'november', 'december'];
const SEASONS = { lente: [2, 3, 4], zomer: [5, 6, 7], herfst: [8, 9, 10], winter: [11, 0, 1] };

const at = (list, i) => list[((i % list.length) + list.length) % list.length];

// Een kalenderblaadje met de dag of maand van vandaag.
const page = (top, big) => `
  <div class="calendar-page">
    <span class="calendar-top">${top}</span>
    <span class="calendar-big">${big}</span>
  </div>`;

function choicesAround(list, answerIndex, wrongOffsets) {
  const answer = at(list, answerIndex);
  const wrong = [...new Set(wrongOffsets.map((o) => at(list, answerIndex + o)))].filter((x) => x !== answer);
  return shuffle([answer, ...shuffle(wrong).slice(0, 3)]);
}

const LEVELS = {
  dagen() {
    const today = rand(0, 6);
    const after = Math.random() < 0.6;
    const target = today + (after ? 1 : -1);
    return {
      key: `d-${today}-${after}`,
      prompt: `Welke dag komt ${after ? 'na' : 'vóór'} ${DAYS[today]}?`,
      answer: at(DAYS, target),
      choices: choicesAround(DAYS, target, after ? [-2, 1, 2, -1] : [2, -1, 1, -2]),
      html: page('vandaag is het', DAYS[today]),
    };
  },
  // Morgen, overmorgen, gisteren, eergisteren en "over 3 dagen".
  rekenen() {
    const today = rand(0, 6);
    const [shift, word] = pick([
      [1, 'morgen'], [2, 'overmorgen'], [-1, 'gisteren'], [-2, 'eergisteren'], [3, 'over 3 dagen'], [-3, '3 dagen geleden'],
    ]);
    const target = today + shift;
    const verb = shift > 0 ? 'is het' : 'was het';
    return {
      key: `r-${today}-${shift}`,
      prompt: `Vandaag is het ${DAYS[today]}. Welke dag ${verb} ${word}?`,
      answer: at(DAYS, target),
      // De verkeerde kant op tellen is de meest gemaakte fout.
      choices: choicesAround(DAYS, target, [-shift * 2, 1, -1, 2, -2]),
      html: page('vandaag is het', DAYS[today]),
    };
  },
  maanden() {
    const month = rand(0, 11);
    const after = Math.random() < 0.6;
    const target = month + (after ? 1 : -1);
    return {
      key: `m-${month}-${after}`,
      prompt: `Welke maand komt ${after ? 'na' : 'vóór'} ${MONTHS[month]}?`,
      answer: at(MONTHS, target),
      choices: choicesAround(MONTHS, target, after ? [-2, 1, 2] : [2, -1, -2]),
      html: page('deze maand is het', MONTHS[month]),
    };
  },
  seizoenen() {
    const month = rand(0, 11);
    const answer = Object.keys(SEASONS).find((s) => SEASONS[s].includes(month));
    return {
      key: `s-${month}`,
      prompt: `In welk seizoen valt ${MONTHS[month]}? (meestal)`,
      answer,
      choices: Object.keys(SEASONS),
      html: page('de maand', MONTHS[month]),
    };
  },
};

export default {
  intro: 'Een week heeft <b>7 dagen</b>: maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag en zondag. Na zondag begint de week weer bij maandag. Een jaar heeft <b>12 maanden</b>.',
  levels: [
    { id: 'dagen', name: 'Dagen van de week', hint: 'Welke dag komt erna?', groups: [3, 4] },
    { id: 'rekenen', name: 'Gisteren en morgen', hint: 'Overmorgen, eergisteren…', groups: [4] },
    { id: 'maanden', name: 'Maanden', hint: 'Welke maand komt erna?', groups: [4] },
    { id: 'seizoenen', name: 'Seizoenen', hint: 'Lente, zomer, herfst, winter', groups: [3, 4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
