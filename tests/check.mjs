// Controleert alle oefeningen: elk onderdeel, elk niveau en elke groep laat
// veel vragen maken en kijkt of ze kloppen. Draaien met:
//
//   node tests/check.mjs
//
// Een fout stopt met code 1. Waarschuwingen (zoals een niveau met minder dan
// 10 verschillende vragen) stoppen niet.
const ROOT = new URL('../', import.meta.url);
const VEHICLES = [
  ['rekenraket/js/planets.js', 'PLANETS'],
  ['meetrover/js/plekken.js', 'PLEKKEN'],
  ['taaltelescoop/js/sterrenbeelden.js', 'STERRENBEELDEN'],
  ['zinnenzender/js/signalen.js', 'SIGNALEN'],
  ['wereldsatelliet/js/kaarten.js', 'KAARTEN'],
  ['leeslander/js/manen.js', 'MANEN'],
];
const TRIES = 500;

let errors = 0;
let warnings = 0;
const fail = (where, msg) => { errors++; console.log(`FOUT  ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`let op ${where}: ${msg}`); };

function checkQuestion(where, q, level) {
  if (!q || typeof q.key === 'undefined' || typeof q.prompt !== 'string' || typeof q.html !== 'string') {
    return fail(where, 'vraag mist key, prompt of html');
  }
  if (/undefined|NaN/.test(q.prompt + q.html)) return fail(where, `undefined of NaN in "${q.prompt}"`);
  const values = q.choices?.map((c) => (typeof c === 'string' ? c : c.value));
  if (values) {
    if (!values.includes(String(q.answer))) return fail(where, `antwoord ${q.answer} staat niet bij de keuzes ${values}`);
    if (new Set(values).size !== values.length) return fail(where, `dubbele keuzes ${values}`);
    if (/class="[^"]*\bslot\b/.test(q.html)) return fail(where, 'keuzevraag met een invulvakje (dan typt het toetsenbord erin)');
  } else if (q.tiles) {
    if ([...q.tiles].sort().join(' ') !== q.answer.split(' ').sort().join(' ')) return fail(where, 'tegels passen niet bij het antwoord');
  } else {
    if (typeof q.answer !== 'number' || q.answer < 0 || !Number.isInteger(q.answer)) return fail(where, `antwoord ${q.answer} is geen heel getal`);
    if (String(q.answer).length > (q.maxDigits || 2)) return fail(where, `antwoord ${q.answer} is langer dan maxDigits`);
    if (!/class="[^"]*\bslot\b/.test(q.html)) return fail(where, 'typvraag zonder invulvakje');
  }
  if (level.timed && !level.starsAt) fail(where, 'race zonder starsAt');
}

for (const [file, name] of VEHICLES) {
  const items = (await import(new URL(file, ROOT)))[name];
  const ids = items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) fail(file, 'dubbele onderdeel-id');
  for (const item of items) {
    const levelIds = item.module.levels.map((l) => l.id);
    if (new Set(levelIds).size !== levelIds.length) fail(`${file} ${item.id}`, 'dubbele niveau-id');
    for (const level of item.module.levels) {
      for (const groep of level.groups) {
        const where = `${file.split('/')[0]}/${item.id}/${level.id} (groep ${groep})`;
        const keys = new Set();
        const before = errors;
        for (let i = 0; i < TRIES && errors === before; i++) {
          let q;
          try {
            q = item.module.makeQuestion(level.id, { name: 'Sam', groep });
          } catch (e) {
            fail(where, `crash: ${e.message}`);
            break;
          }
          checkQuestion(where, q, level);
          keys.add(q.key);
        }
        if (errors === before && keys.size < 10) warn(where, `maar ${keys.size} verschillende vragen`);
      }
    }
  }
}

console.log(errors ? `\n${errors} fout(en), ${warnings} waarschuwing(en)` : `\nAlles in orde (${warnings} waarschuwing(en))`);
process.exit(errors ? 1 : 0);
