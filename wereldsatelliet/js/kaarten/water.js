import { pick, shuffle } from '../../../shared/js/util.js';
import { EILANDEN, byId, mapSvg } from '../nederland.js';

// Water: zeeën, meren en rivieren. [vraag, goed, fout, fout, wat de kaart
// aanwijst]. De kaart laat zien waar het over gaat, het kind zegt hoe het heet.
const ACCENT = 'var(--accent)';
const WATER = [
  ['Welke zee ligt aan de westkant van Nederland?', 'de Noordzee', 'de Waddenzee', 'de Middellandse Zee', { dots: [[52.5, 3.9]] }],
  ['Welke zee ligt tussen de Waddeneilanden en het vasteland?', 'de Waddenzee', 'de Noordzee', 'het IJsselmeer',
    { islands: true, dots: [[53.3, 5.5]] }],
  ['Welk meer ligt tussen Noord-Holland en Friesland?', 'het IJsselmeer', 'de Waddenzee', 'het Veluwemeer', { dots: [[52.85, 5.3]] }],
  ['Welke dijk sluit het IJsselmeer af van de Waddenzee?', 'de Afsluitdijk', 'de Deltawerken', 'de Hondsrug', { dots: [[53.0, 5.18]] }],
  ['Welke rivier stroomt door Limburg?', 'de Maas', 'de IJssel', 'de Schelde', { river: 'Maas', mark: { li: ACCENT } }],
  ['Welke rivier stroomt bij Lobith Nederland binnen?', 'de Rijn', 'de Maas', 'de Schelde', { river: 'Rijn', dots: [[51.86, 6.11]] }],
  ['Welke rivier stroomt langs Nijmegen?', 'de Waal', 'de IJssel', 'de Maas', { river: 'Waal', dots: [[51.84, 5.86]] }],
  ['Welke rivier stroomt langs Deventer en Zutphen?', 'de IJssel', 'de Waal', 'de Maas', { river: 'IJssel', dots: [[52.25, 6.16], [52.14, 6.19]] }],
  ['Waar stroomt de IJssel naartoe?', 'naar het IJsselmeer', 'naar de Noordzee bij Zeeland', 'naar Limburg', { river: 'IJssel' }],
  ['Welke rivier stroomt door Zeeland naar zee?', 'de Schelde', 'de IJssel', 'de Rijn', { river: 'Schelde' }],
  ['Welke provincie is gemaakt van drooggemalen land?', 'Flevoland', 'Limburg', 'Drenthe', { mark: { fl: ACCENT } }],
  ['Hoe heten de grote dammen en sluizen in Zeeland tegen het zeewater?', 'de Deltawerken', 'de Afsluitdijk', 'de Waddeneilanden',
    { dots: [[51.65, 3.72]] }],
];

function water() {
  const [vraag, answer, wrong1, wrong2, kaart] = pick(WATER);
  return {
    key: vraag,
    prompt: vraag,
    answer,
    choices: shuffle([answer, wrong1, wrong2]),
    choiceStyle: 'list',
    html: mapSvg({ rivers: true, ...kaart }),
  };
}

// Na het antwoord wijst de kaart het goede eiland aan.
function showIsland(el, name) {
  el.querySelector('.nl-map').outerHTML = mapSvg({ islands: true, island: name });
}

// De Waddeneilanden van west naar oost: TV TAS.
function eiland() {
  const kind = pick(['volgorde', 'provincie', 'west', 'oost']);
  const names = EILANDEN.map(([n]) => n);
  if (kind === 'west' || kind === 'oost') {
    const answer = kind === 'west' ? names[0] : names[4];
    return {
      key: kind,
      prompt: `Welk bewoond Waddeneiland ligt het meest naar het ${kind === 'west' ? 'westen' : 'oosten'}?`,
      answer,
      choices: shuffle([answer, ...shuffle(names.filter((n) => n !== answer)).slice(0, 2)]),
      choiceStyle: 'list',
      revealText: `Denk aan TV TAS: ${names.join(', ')}.`,
      html: mapSvg({ islands: true }),
      onSolved: (el) => showIsland(el, answer),
    };
  }
  if (kind === 'volgorde') {
    const i = Math.floor(Math.random() * 4);
    const answer = names[i + 1];
    return {
      key: `na-${names[i]}`,
      prompt: `Welk eiland komt na ${names[i]}, van west naar oost?`,
      answer,
      choices: shuffle([answer, ...shuffle(names.filter((n) => n !== answer && n !== names[i])).slice(0, 2)]),
      choiceStyle: 'list',
      revealText: `Denk aan TV TAS: ${names.join(', ')}.`,
      html: mapSvg({ islands: true, island: names[i] }),
      onSolved: (el) => showIsland(el, answer),
    };
  }
  const [name, id] = pick(EILANDEN);
  const answer = byId(id).name;
  return {
    key: `prov-${name}`,
    prompt: `Bij welke provincie hoort ${name}?`,
    answer,
    choices: shuffle([answer, ...shuffle(['Noord-Holland', 'Friesland', 'Groningen', 'Zeeland'].filter((n) => n !== answer)).slice(0, 2)]),
    choiceStyle: 'list',
    revealText: `${name} hoort bij ${answer}.`,
    html: mapSvg({ islands: true, island: name }),
    onSolved(el) {
      el.querySelector('.nl-map').outerHTML = mapSvg({ islands: true, island: name, mark: { [id]: ACCENT } });
    },
  };
}

export default {
  intro: 'Nederland heeft veel water. In het westen ligt de <b>Noordzee</b>, in het noorden de <b>Waddenzee</b> met de Waddeneilanden. Onthoud ze van west naar oost met <b>TV TAS</b>: Texel, Vlieland, Terschelling, Ameland en Schiermonnikoog.',
  levels: [
    { id: 'water', name: 'Zeeën en rivieren', hint: 'Noordzee, Rijn en Maas', groups: [5] },
    { id: 'eilanden', name: 'Waddeneilanden', hint: 'TV TAS', groups: [5] },
  ],
  makeQuestion(level) {
    return level === 'water' ? water() : eiland();
  },
};
