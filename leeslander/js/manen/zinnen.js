import { pick, shuffle } from '../../../shared/js/util.js';

// Lees de zin en kies het plaatje dat erbij past. De foute plaatjes lijken
// er steeds op: een ander dier, of een ander ding. Zo moet je de hele zin lezen.
const KORT = {
  dieren: [['kat', '🐱'], ['hond', '🐶'], ['aap', '🐒'], ['koe', '🐄'], ['kip', '🐔'], ['muis', '🐭'], ['beer', '🐻'], ['uil', '🦉']],
  dingen: [['bal', '⚽'], ['pet', '🧢'], ['jas', '🧥'], ['vis', '🐟'], ['ijsje', '🍦'], ['boot', '🚤'], ['kaas', '🧀'],
    ['sok', '🧦'], ['pen', '🖊️'], ['roos', '🌹'], ['peer', '🍐'], ['taart', '🎂']],
  doen: ['heeft een', 'ziet een', 'pakt een'],
};

const LANG = {
  dieren: [['olifant', '🐘'], ['giraf', '🦒'], ['pinguïn', '🐧'], ['krokodil', '🐊'], ['konijn', '🐰'],
    ['kikker', '🐸'], ['schildpad', '🐢'], ['varken', '🐷']],
  dingen: [['ballon', '🎈'], ['paraplu', '☂️'], ['taart', '🎂'], ['banaan', '🍌'], ['gitaar', '🎸'], ['fiets', '🚲'],
    ['boek', '📕'], ['cadeau', '🎁'], ['zonnebril', '🕶️'], ['sleutel', '🔑']],
  plekken: [['op het strand', '🏖️'], ['in de sneeuw', '❄️'], ['in het bos', '🌲'], ['op de maan', '🌙'],
    ['in de regen', '🌧️'], ['op de berg', '⛰️'], ['in de stad', '🏙️']],
  doen: ['heeft een', 'ziet een', 'zoekt een', 'draagt een'],
};

// Kies een ander element uit dezelfde lijst.
const other = (list, not) => pick(list.filter((x) => x !== not));
const pics = (...parts) => parts.map(([, p]) => p).join(' ');

function kort() {
  const dier = pick(KORT.dieren);
  const ding = pick(KORT.dingen);
  const answer = pics(dier, ding);
  return {
    sentence: `De ${dier[0]} ${pick(KORT.doen)} ${ding[0]}.`,
    key: `${dier[0]}-${ding[0]}`,
    answer,
    choices: [answer, pics(other(KORT.dieren, dier), ding), pics(dier, other(KORT.dingen, ding))],
  };
}

function lang() {
  const dier = pick(LANG.dieren);
  const ding = pick(LANG.dingen);
  const plek = pick(LANG.plekken);
  const answer = pics(dier, ding, plek);
  return {
    sentence: `De ${dier[0]} ${pick(LANG.doen)} ${ding[0]} ${plek[0]}.`,
    key: `${dier[0]}-${ding[0]}-${plek[0]}`,
    answer,
    choices: [answer, pics(other(LANG.dieren, dier), ding, plek), pics(dier, other(LANG.dingen, ding), plek),
      pics(dier, ding, other(LANG.plekken, plek))],
  };
}

export default {
  intro: 'Lees de zin goed. Welk plaatje past erbij? Let op: ze lijken veel op elkaar!',
  levels: [
    { id: 'kort', name: 'Korte zinnen', hint: 'De kat heeft een bal.', groups: [3, 4] },
    { id: 'lang', name: 'Lange zinnen', hint: 'De giraf ziet een taart op de maan.', groups: [4] },
  ],
  makeQuestion(level) {
    const { sentence, key, answer, choices } = level === 'kort' ? kort() : lang();
    return {
      key,
      prompt: 'Welk plaatje past bij de zin?',
      answer,
      choices: shuffle(choices),
      choiceStyle: 'big',
      revealText: 'Kijk, dit plaatje past bij de zin.',
      html: `<p class="read-card">${sentence}</p>`,
    };
  },
};
