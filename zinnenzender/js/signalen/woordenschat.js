import { pick, shuffle } from '../../../shared/js/util.js';

// Woordenschat: het tegenovergestelde, een woord dat hetzelfde betekent, en
// welk woord er niet bij hoort.
const TEGEN = [['groot', 'klein'], ['warm', 'koud'], ['lang', 'kort'], ['hoog', 'laag'], ['snel', 'langzaam'],
  ['blij', 'verdrietig'], ['dag', 'nacht'], ['open', 'dicht'], ['vol', 'leeg'], ['nat', 'droog'], ['licht', 'donker'],
  ['dik', 'dun'], ['oud', 'jong'], ['boven', 'onder'], ['voor', 'achter'], ['binnen', 'buiten'],
  ['lachen', 'huilen'], ['geven', 'nemen'], ['begin', 'eind'], ['schoon', 'vies'], ['zacht', 'hard'], ['links', 'rechts'],
  ['veel', 'weinig'], ['aan', 'uit'], ['winnen', 'verliezen']];

const HETZELFDE = [['blij', 'vrolijk'], ['snel', 'vlug'], ['groot', 'enorm'], ['mooi', 'prachtig'], ['praten', 'kletsen'],
  ['bang', 'angstig'], ['boos', 'kwaad'], ['klein', 'piepklein'], ['beginnen', 'starten'], ['heel', 'erg'],
  ['dapper', 'moedig'], ['slim', 'knap'], ['raar', 'vreemd'], ['kijken', 'zien'], ['pakken', 'grijpen'], ['stil', 'rustig'],
  ['fiets', 'rijwiel'], ['dokter', 'arts'], ['vies', 'smerig'], ['rennen', 'hollen']];

const GROEPEN = {
  dieren: ['hond', 'kat', 'koe', 'paard', 'schaap', 'geit', 'konijn', 'muis'],
  fruit: ['appel', 'peer', 'banaan', 'druif', 'kers', 'citroen', 'aardbei'],
  kleuren: ['rood', 'blauw', 'geel', 'groen', 'paars', 'oranje', 'roze'],
  kleren: ['jas', 'broek', 'sok', 'trui', 'muts', 'rok', 'jurk'],
  voertuigen: ['auto', 'bus', 'fiets', 'trein', 'boot', 'vliegtuig', 'tram'],
  meubels: ['tafel', 'stoel', 'bank', 'kast', 'bed', 'bureau'],
  lichaamsdelen: ['arm', 'been', 'neus', 'oor', 'hand', 'voet', 'knie'],
};

// Alle woorden uit een lijst van paren, behalve de twee van dit paar.
const others = (pairs, pair) => pairs.flat().filter((w) => !pair.includes(w));

function pairQuestion(pairs, kind) {
  const pair = pick(pairs);
  const [word, answer] = Math.random() < 0.5 ? pair : [...pair].reverse();
  const wrong = shuffle(others(pairs, pair)).slice(0, 2);
  const tegen = kind === 'tegen';
  return {
    key: `${kind}-${word}`,
    prompt: tegen ? 'Wat is het tegenovergestelde?' : 'Welk woord betekent hetzelfde?',
    answer,
    choices: shuffle([answer, ...wrong]),
    revealText: tegen ? `Het tegenovergestelde van ${word} is ${answer}.` : `${word} en ${answer} betekenen hetzelfde.`,
    html: `<p class="signal-word">${word}</p>`,
  };
}

function oddOne() {
  const [group, other] = shuffle(Object.keys(GROEPEN));
  const words = shuffle(GROEPEN[group]).slice(0, 3);
  const answer = pick(GROEPEN[other].filter((w) => !GROEPEN[group].includes(w)));
  return {
    key: `vreemd-${answer}`,
    prompt: 'Welk woord hoort er niet bij?',
    answer,
    choices: shuffle([...words, answer]),
    revealText: `${answer} hoort er niet bij. De andere zijn allemaal ${group}.`,
    html: '',
  };
}

export default {
  intro: 'Hoe meer woorden je kent, hoe beter je leest en praat. Het tegenovergestelde van <b>groot</b> is <b>klein</b>. <b>Blij</b> en <b>vrolijk</b> betekenen hetzelfde.',
  levels: [
    { id: 'tegen', name: 'Tegenstellingen', hint: 'Groot en klein', groups: [3, 4] },
    { id: 'vreemd', name: 'Hoort er niet bij', hint: 'Appel, peer, banaan, auto', groups: [3, 4] },
    { id: 'hetzelfde', name: 'Hetzelfde', hint: 'Blij en vrolijk', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'tegen') return pairQuestion(TEGEN, 'tegen');
    if (level === 'hetzelfde') return pairQuestion(HETZELFDE, 'hetzelfde');
    return oddOne();
  },
};
