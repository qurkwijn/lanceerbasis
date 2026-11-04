import { pick, shuffle } from '../../../shared/js/util.js';
import { PROVINCIES, STEDEN, byId, mapSvg } from '../nederland.js';

// Hoofdsteden van de provincies, en in welke provincie de grote steden liggen.
function hoofdstad() {
  const p = pick(PROVINCIES);
  const others = shuffle(PROVINCIES.filter((o) => o !== p)).slice(0, 2);
  if (Math.random() < 0.5) {
    return {
      key: `hs-${p.id}`,
      prompt: `Wat is de hoofdstad van ${p.name}?`,
      answer: p.hoofdstad,
      choices: shuffle([p, ...others]).map((o) => o.hoofdstad),
      choiceStyle: 'list',
      revealText: `De hoofdstad van ${p.name} is ${p.hoofdstad}.`,
      html: mapSvg({ mark: { [p.id]: 'var(--accent)' } }),
    };
  }
  return {
    key: `hs-terug-${p.id}`,
    prompt: `Van welke provincie is ${p.hoofdstad} de hoofdstad?`,
    answer: p.name,
    choices: shuffle([p, ...others]).map((o) => o.name),
    choiceStyle: 'list',
    revealText: `${p.hoofdstad} is de hoofdstad van ${p.name}.`,
    html: mapSvg(),
  };
}

function stad() {
  const [name, id] = pick(STEDEN);
  const p = byId(id);
  const others = shuffle(PROVINCIES.filter((o) => o !== p)).slice(0, 2);
  return {
    key: `stad-${name}`,
    prompt: `In welke provincie ligt ${name}?`,
    answer: p.name,
    choices: shuffle([p, ...others]).map((o) => o.name),
    choiceStyle: 'list',
    revealText: `${name} ligt in ${p.name}.`,
    html: mapSvg(),
    onSolved(el) {
      el.querySelector('.nl-map').outerHTML = mapSvg({ mark: { [id]: 'var(--accent)' } });
    },
  };
}

export default {
  intro: 'Elke provincie heeft een <b>hoofdstad</b>, zoals Arnhem in Gelderland. De hoofdstad van Nederland is <b>Amsterdam</b>, maar de regering zit in <b>Den Haag</b>.',
  levels: [
    { id: 'hoofdstad', name: 'Hoofdsteden', hint: 'Arnhem, Zwolle en Assen', groups: [5] },
    { id: 'stad', name: 'Grote steden', hint: 'Waar ligt Eindhoven?', groups: [5] },
  ],
  makeQuestion(level) {
    return level === 'hoofdstad' ? hoofdstad() : stad();
  },
};
