import { pick } from './util.js';

// Een herhaalniveau: vragen uit alle onderdelen van een vorige groep door
// elkaar. Op school wordt de oude stof elke dag herhaald; zo hoeft die in de
// nieuwe groep niet als losse onderdelen op de kaart te staan.
// `getItems` geeft de onderdelen van het voertuig (planeten, sterrenbeelden…).
// Voor elke groep in `from` komt er een niveau voor de groep erna.
export function herhaal(getItems, { intro, from }) {
  const pool = (groep) => getItems().flatMap((item) => item.module.levels
    .filter((l) => l.groups.includes(groep) && !l.timed)
    .map((level) => [item, level]));
  return {
    // Herhalen tonen we niet op slot aan een lagere groep.
    review: true,
    intro,
    levels: from.map((g) => ({ id: `groep${g}`, name: `Alles uit groep ${g}`, hint: 'Door elkaar', groups: [g + 1] })),
    makeQuestion(id, profile) {
      const groep = Number(id.replace('groep', ''));
      const [item, level] = pick(pool(groep));
      const q = item.module.makeQuestion(level.id, { ...profile, groep });
      return { ...q, key: `${item.id}-${q.key}` };
    },
  };
}
