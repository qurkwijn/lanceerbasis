import { STATIONS } from './stations.js';

// Voor ouders: wat er per groep in elk voertuig zit, en waarom juist daar.
// De uitgebreide versie staat in docs/leerstof.md. Houd het venster op één
// telefoonscherm, ook bij nieuwe groepen: één zin intro en per voertuig één
// korte regel met trefwoorden.
const UITLEG = {
  3: {
    intro: 'Het jaar van leren lezen, en rekenen tot 20.',
    rekenraket: 'tellen, splitsen, plus en min tot 20, sprongen van 2, 5 en 10',
    meetrover: 'hele en halve uren, dagen en seizoenen, geld tot €20, vormen',
    taaltelescoop: 'woorden schrijven zoals je ze hoort, kort of lang',
    zinnenzender: 'alfabet, hoofdletter en punt, tegenstellingen',
    leeslander: 'klanken, woorden snel lezen, korte zinnen en verhaaltjes (AVI E3)',
  },
  4: {
    intro: 'Alles wordt groter en sneller: tot 100, de eerste tafels en de spellingregels.',
    rekenraket: 'tot 100, over het tiental, tafels 1 t/m 5 en 10 (6 t/m 9 in groep 5)',
    meetrover: 'kwartieren, maanden, geld tot €100, liniaal, grafieken',
    taaltelescoop: 'spellingcategorie 1 t/m 12 (zoals in Staal), ei/ij en au/ou',
    zinnenzender: 'woordenboekvolgorde, namen, meervoud, woorden die hetzelfde betekenen',
    leeslander: 'sneller lezen (AVI E4) en begrijpend lezen, ook weetjesteksten',
  },
};

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
    <ul class="groep-list">
      ${STATIONS.filter((s) => s.ready && s.groups.includes(groep) && uitleg[s.id]).map((s) => `
        <li><b>${s.name}</b> ${uitleg[s.id]}</li>`).join('')}
    </ul>
    <p class="info-small">Op basis van de kerndoelen en de meest gebruikte methodes.</p>
    <button type="button" class="btn info-close" data-close>Sluiten</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog.showModal();
}
