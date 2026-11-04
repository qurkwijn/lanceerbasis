import { pick, shuffle } from '../../../shared/js/util.js';
import { EILANDEN, byId, mapSvg } from '../nederland.js';

// Water: zeeën, meren en rivieren. [vraag, goed, fout, fout]
const WATER = [
  ['Welke zee ligt aan de westkant van Nederland?', 'de Noordzee', 'de Waddenzee', 'de Middellandse Zee'],
  ['Welke zee ligt tussen de Waddeneilanden en het vasteland?', 'de Waddenzee', 'de Noordzee', 'het IJsselmeer'],
  ['Welk meer ligt tussen Noord-Holland en Friesland?', 'het IJsselmeer', 'de Waddenzee', 'het Veluwemeer'],
  ['Welke dijk sluit het IJsselmeer af van de Waddenzee?', 'de Afsluitdijk', 'de Deltawerken', 'de Hondsrug'],
  ['Welke rivier stroomt door Limburg?', 'de Maas', 'de IJssel', 'de Schelde'],
  ['Welke rivier stroomt bij Lobith Nederland binnen?', 'de Rijn', 'de Maas', 'de Schelde'],
  ['Welke rivier stroomt langs Nijmegen?', 'de Waal', 'de IJssel', 'de Maas'],
  ['Welke rivier stroomt langs Deventer en Zutphen?', 'de IJssel', 'de Waal', 'de Maas'],
  ['Waar stroomt de IJssel naartoe?', 'naar het IJsselmeer', 'naar de Noordzee bij Zeeland', 'naar Limburg'],
  ['Welke rivier stroomt door Zeeland naar zee?', 'de Schelde', 'de IJssel', 'de Rijn'],
  ['Welke provincie is gemaakt van drooggemalen land?', 'Flevoland', 'Limburg', 'Drenthe'],
  ['Hoe heten de grote dammen en sluizen in Zeeland tegen het zeewater?', 'de Deltawerken', 'de Afsluitdijk', 'de Waddeneilanden'],
];

function water() {
  const [vraag, answer, ...wrong] = pick(WATER);
  return {
    key: vraag,
    prompt: vraag,
    answer,
    choices: shuffle([answer, ...wrong]),
    choiceStyle: 'list',
    html: mapSvg({ islands: true }),
  };
}

// De Waddeneilanden van west naar oost: TV TAS.
function eiland() {
  const kind = pick(['volgorde', 'provincie', 'west', 'oost']);
  const names = EILANDEN.map(([n]) => n);
  if (kind === 'west' || kind === 'oost') {
    const answer = kind === 'west' ? names[0] : names[4];
    return {
      key: kind,
      prompt: `Welk Waddeneiland ligt het meest naar het ${kind === 'west' ? 'westen' : 'oosten'}?`,
      answer,
      choices: shuffle([answer, ...shuffle(names.filter((n) => n !== answer)).slice(0, 2)]),
      choiceStyle: 'list',
      revealText: `Denk aan TV TAS: ${names.join(', ')}.`,
      html: mapSvg({ islands: true }),
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
