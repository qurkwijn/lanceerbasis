import { pick, shuffle } from '../../../shared/js/util.js';
import { PROVINCIES, byId, mapSvg } from '../nederland.js';

// De twaalf provincies: welke is dit, en welke ligt ernaast?
function welke() {
  const p = pick(PROVINCIES);
  const others = shuffle(PROVINCIES.filter((o) => o !== p)).slice(0, 2);
  return {
    key: `welke-${p.id}`,
    prompt: 'Welke provincie is geel?',
    answer: p.name,
    choices: shuffle([p, ...others]).map((o) => o.name),
    choiceStyle: 'list',
    revealText: `Dat is ${p.name}.`,
    html: mapSvg({ mark: { [p.id]: 'var(--accent)' } }),
  };
}

function buren() {
  const p = pick(PROVINCIES);
  const answer = byId(pick(p.buren));
  const far = shuffle(PROVINCIES.filter((o) => o !== p && !p.buren.includes(o.id) && !p.water.includes(o.id))).slice(0, 2);
  return {
    key: `buren-${p.id}-${answer.id}`,
    prompt: `Welke provincie grenst aan ${p.name}?`,
    answer: answer.name,
    choices: shuffle([answer, ...far]).map((o) => o.name),
    choiceStyle: 'list',
    revealText: `${answer.name} ligt naast ${p.name}.`,
    html: mapSvg({ mark: { [p.id]: 'var(--accent)' } }),
  };
}

export default {
  intro: 'Nederland heeft <b>12 provincies</b>. Op de kaart is boven het noorden en onder het zuiden. Het water zie je blauw.',
  levels: [
    { id: 'welke', name: 'Welke provincie?', hint: 'Zoek hem op de kaart', groups: [5] },
    { id: 'buren', name: 'De buren', hint: 'Welke provincie ligt ernaast?', groups: [5] },
  ],
  makeQuestion(level) {
    return level === 'welke' ? welke() : buren();
  },
};
