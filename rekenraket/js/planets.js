import tellen from './planets/tellen.js';
import vergelijken from './planets/vergelijken.js';
import splitsen from './planets/splitsen.js';
import harten from './planets/harten.js';
import dubbelen from './planets/dubbelen.js';
import plusmin from './planets/plusmin.js';
import getallenlijn from './planets/getallenlijn.js';
import tientallen from './planets/tientallen.js';
import tafels from './planets/tafels.js';
import delen from './planets/delen.js';
import verhaaltjes from './planets/verhaaltjes.js';
import snelrekenen from './planets/snelrekenen.js';

// Eén planeet uit de niveaus van meerdere onderdelen, zodat de kaart kort
// blijft. Met `prefix` blijven de niveau-id's uniek, met `only` neem je maar
// een paar niveaus over en met `label` zet je iets voor de naam.
function combine(intro, parts) {
  const levels = parts.flatMap(({ module, prefix = '', only, label = '' }) => module.levels
    .filter((l) => !only || only.includes(l.id))
    .map((l) => ({ ...l, id: prefix + l.id, name: label + l.name, source: { module, prefix } })));
  return {
    intro,
    levels: levels.map(({ source, ...l }) => l),
    makeQuestion(id, profile) {
      const { source } = levels.find((l) => l.id === id);
      return source.module.makeQuestion(id.slice(source.prefix.length), profile);
    },
  };
}

const race = (only) => ({ module: snelrekenen, prefix: 'race-', only, label: '🏁 ' });

// Elke planeet is een rekenonderdeel, ongeveer van makkelijk naar moeilijk.
// Welke niveaus je ziet, hangt af van je groep (zie `groups` per niveau).
// Meten, tijd, geld en vormen staan in de Meetrover.
export const PLANETS = [
  { id: 'tellen', name: 'Tellen', colors: ['#ffd3a8', '#f08a4b'], module: tellen },
  { id: 'meer-minder', name: 'Meer of minder', colors: ['#b8f5a0', '#4caf50'], ring: true, module: vergelijken },
  {
    id: 'splitsen', name: 'Splitsen', colors: ['#ffb86b', '#e8476a'],
    module: combine(`${splitsen.intro} Getallen die samen 10 zijn, heten <b>verliefde harten</b>.`, [
      { module: splitsen }, { module: harten }]),
  },
  { id: 'dubbelen', name: 'Dubbelen en even', colors: ['#ffe9a0', '#d9a520'], module: dubbelen },
  {
    id: 'plus-min', name: 'Plus en min', colors: ['#8af0b0', '#2a9d6a'],
    module: combine(`${plusmin.intro} Bij 🏁 race je een minuut tegen de klok.`, [
      { module: plusmin }, race(['plus10', 'min10', 'tot20', 'over10'])]),
  },
  {
    id: 'getallen', name: 'Getallen', colors: ['#c0d4ff', '#4a63c8'], ring: true,
    module: combine(`${getallenlijn.intro} ${tientallen.intro}`, [
      { module: getallenlijn, prefix: 'lijn-' }, { module: tientallen }]),
  },
  {
    id: 'tafels', name: 'Tafels', colors: ['#d2b0ff', '#7a4fd6'], ring: true,
    module: combine(tafels.intro, [{ module: tafels }, race(['tafels'])]),
  },
  { id: 'delen', name: 'Eerlijk delen', colors: ['#ffc4e1', '#c2549a'], module: delen },
  { id: 'verhaaltjes', name: 'Verhaaltjessommen', colors: ['#f0c8ff', '#9b4fd6'], module: verhaaltjes },
];
