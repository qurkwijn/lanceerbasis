import { pick, shuffle } from '../../../shared/js/util.js';
import { PROVINCIES, mapSvg } from '../nederland.js';

// Windrichtingen: noord, oost, zuid en west. We vragen alleen naar twee
// provincies die duidelijk in één richting van elkaar liggen.
const RICHTINGEN = ['ten noorden', 'ten oosten', 'ten zuiden', 'ten westen'];

function pair() {
  for (;;) {
    const [a, b] = shuffle(PROVINCIES).slice(0, 2);
    const dLat = a.pos[0] - b.pos[0];
    const dLon = a.pos[1] - b.pos[1];
    if (Math.abs(dLat) >= 0.45 && Math.abs(dLon) <= 0.35) return [a, b, dLat > 0 ? 'ten noorden' : 'ten zuiden'];
    if (Math.abs(dLon) >= 0.8 && Math.abs(dLat) <= 0.3) return [a, b, dLon > 0 ? 'ten oosten' : 'ten westen'];
  }
}

function richting() {
  const [a, b, answer] = pair();
  return {
    key: `${a.id}-${b.id}`,
    prompt: `${a.name} ligt … van ${b.name}.`,
    answer,
    choices: shuffle(RICHTINGEN),
    choiceStyle: 'list',
    revealText: `${a.name} ligt ${answer} van ${b.name}.`,
    html: `${mapSvg({ mark: { [a.id]: 'var(--accent)', [b.id]: '#5b9dff' }, compass: true })}
      <p class="map-legend"><span class="dot a"></span> ${a.name} <span class="dot b"></span> ${b.name}</p>`,
  };
}

// Waar in Nederland ligt een provincie?
const WAAR = { gr: 'in het noorden', fr: 'in het noorden', dr: 'in het noorden', ze: 'in het zuiden', nb: 'in het zuiden',
  li: 'in het zuiden', nh: 'in het westen', zh: 'in het westen', ov: 'in het oosten', ge: 'in het oosten' };

function waar() {
  const id = pick(Object.keys(WAAR));
  const p = PROVINCIES.find((o) => o.id === id);
  return {
    key: `waar-${id}`,
    prompt: `Waar in Nederland ligt ${p.name}?`,
    answer: WAAR[id],
    choices: shuffle(['in het noorden', 'in het oosten', 'in het zuiden', 'in het westen']),
    choiceStyle: 'list',
    revealText: `${p.name} ligt ${WAAR[id]} van Nederland.`,
    html: mapSvg({ mark: { [id]: 'var(--accent)' }, compass: true }),
  };
}

export default {
  intro: 'Op een kaart is boven altijd het <b>noorden</b>, onder het <b>zuiden</b>, rechts het <b>oosten</b> en links het <b>westen</b>. Met de klok mee: <b>N</b>ooit <b>O</b>p <b>Z</b>ondag <b>W</b>assen.',
  levels: [
    { id: 'waar', name: 'Waar ligt het?', hint: 'Noorden, oosten, zuiden of westen', groups: [5] },
    { id: 'richting', name: 'Ten noorden van…', hint: 'Groningen ligt ten noorden van…', groups: [5] },
  ],
  makeQuestion(level) {
    return level === 'waar' ? waar() : richting();
  },
};
