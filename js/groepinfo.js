import { MANEN } from '../leeslander/js/manen.js';
import { PLEKKEN } from '../meetrover/js/plekken.js';
import { PLANETS } from '../rekenraket/js/planets.js';
import { STERRENBEELDEN } from '../taaltelescoop/js/sterrenbeelden.js';
import { SIGNALEN } from '../zinnenzender/js/signalen.js';
import { STATIONS } from './stations.js';

// Voor ouders: wat er per groep in elk voertuig zit, en waarom juist daar. De
// onderdelen halen we uit de voertuigen zelf, zodat de lijst altijd klopt. De
// uitleg volgt docs/leerstof.md.
//
// Bij sterrenbeelden en manen zegt de ondertitel meer dan de naam ("De Kat"
// is hakken en plakken).
const ONDERDELEN = {
  rekenraket: [PLANETS, (o) => o.name],
  meetrover: [PLEKKEN, (o) => o.name],
  taaltelescoop: [STERRENBEELDEN, (o) => o.sub],
  zinnenzender: [SIGNALEN, (o) => o.name],
  leeslander: [MANEN, (o) => o.sub],
};

const UITLEG = {
  3: {
    intro: 'Groep 3 is het jaar van leren lezen. Kinderen leren alle letters en klanken, en rekenen eerst tot 10 en daarna tot 20.',
    rekenraket: 'Tellen, splitsen en plus en min tot 20 zijn de basis voor al het rekenen daarna. Sprongen van 2, 5 en 10 bereiden de tafels voor.',
    meetrover: 'Eind groep 3 kijken kinderen klok op hele en halve uren, kennen ze de dagen en seizoenen en rekenen ze met munten tot €20.',
    taaltelescoop: 'In groep 3 schrijf je woorden zoals je ze hoort. Daarom hakken en plakken, en het verschil tussen korte en lange klanken.',
    zinnenzender: 'Kinderen leren het alfabet, en dat een zin begint met een hoofdletter en eindigt met een punt. Met tegenstellingen en groepjes woorden groeit de woordenschat.',
    leeslander: 'Klanken horen en woorden snel herkennen is de kern van groep 3. Eind groep 3 lezen de meeste kinderen korte zinnen en verhaaltjes (AVI E3).',
  },
  4: {
    intro: 'In groep 4 wordt alles groter en sneller: rekenen tot 100, de eerste tafels, en spellingregels voor woorden die je niet zomaar hoort.',
    rekenraket: 'Getallen tot 100, plus en min over het tiental en de tafels van 1 tot en met 5 en 10. De tafels van 6 tot en met 9 komen in groep 5.',
    meetrover: 'Kwartieren, maanden, geld tot €100 met wisselgeld, meten met de liniaal en eenvoudige grafieken aflezen.',
    taaltelescoop: 'De spellingcategorieën 1 tot en met 12 die de meeste scholen in groep 4 doen (zoals in de methode Staal), en de onthoudwoorden ei/ij en au/ou.',
    zinnenzender: 'Het alfabet voor het woordenboek, namen met een hoofdletter, meervoud en woorden die hetzelfde betekenen.',
    leeslander: 'Het leestempo gaat omhoog (van AVI E3 naar E4) en begrijpend lezen begint, ook met teksten over echte dingen.',
  },
};

function onderdelen(id, groep) {
  const [list, label] = ONDERDELEN[id];
  return list.filter((o) => o.module.levels.some((l) => l.groups.includes(groep))).map(label).join(' · ');
}

// Het blokje onder de voertuigen; alleen voor groepen met uitleg.
export const groepInfoButton = (groep) => (UITLEG[groep]
  ? `<button type="button" class="groep-info-btn" data-groep-info>📖 Wat zit er in groep ${groep}?</button>`
  : '');

export function showGroepInfo(groep) {
  const uitleg = UITLEG[groep];
  const dialog = document.createElement('dialog');
  dialog.className = 'info-dialog';
  dialog.setAttribute('aria-labelledby', 'groep-info-title');
  dialog.innerHTML = `
    <h2 id="groep-info-title" tabindex="-1" autofocus>Groep ${groep}</h2>
    <p>${uitleg.intro}</p>
    ${STATIONS.filter((s) => s.ready && s.groups.includes(groep) && uitleg[s.id]).map((s) => `
      <h3>${s.name} <span class="info-subject">· ${s.subject}</span></h3>
      <p>${uitleg[s.id]}</p>
      <p class="info-small">${onderdelen(s.id, groep)}</p>`).join('')}
    <p class="info-small">Gebaseerd op de kerndoelen, de leerlijnen per groep en de meest gebruikte methodes. De volgorde op jullie school kan net anders zijn.</p>
    <button type="button" class="btn info-close" data-close>Sluiten</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog.showModal();
}
