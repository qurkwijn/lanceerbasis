import geld from './plekken/geld.js';
import grafieken from './plekken/grafieken.js';
import kalender from './plekken/kalender.js';
import klok from './plekken/klok.js';
import meten from './plekken/meten.js';
import patronen from './plekken/patronen.js';
import { herhaal } from '../../shared/js/herhaal.js';

// De plekken op Mars waar de rover naartoe rijdt. Elke plek is een stukje
// meten, tijd, geld of meetkunde. Hoe meer sterren, hoe hoger de vlag.
export const PLEKKEN = [
  { id: 'klok', name: 'Klokkijken', sub: 'Hoe laat is het?', icon: '🕰️', module: klok },
  { id: 'kalender', name: 'Kalender', sub: 'Dagen, maanden en seizoenen', icon: '📅', module: kalender },
  { id: 'geld', name: 'Geld', sub: 'Tellen en betalen', icon: '💶', module: geld },
  { id: 'meten', name: 'Meten en wegen', sub: 'Lang, kort, zwaar en licht', icon: '📏', module: meten },
  { id: 'grafieken', name: 'Tabellen en grafieken', sub: 'Turven en aflezen', icon: '📊', module: grafieken },
  { id: 'vormen', name: 'Vormen en ruimte', sub: 'Patronen, spiegelen en plattegronden', icon: '🔷', module: patronen },
  {
    id: 'herhaal', name: 'Herhalen', sub: 'Alles uit de vorige groep', icon: '🔁',
    module: herhaal(() => PLEKKEN, { from: [4], intro: 'Hier komt alles uit de vorige groep door elkaar voorbij. Zo blijf je het goed weten!' }),
  },
];

// Een plek: een kraterheuvel met het onderwerp erop en een vlaggenmast. Bij
// `phase` 0 staat de vlag onderaan, bij 1 wappert hij bovenin.
export function plekHtml(plek, phase = 0, size = 96) {
  return `<span class="plek" style="--size:${size}px;--phase:${phase}" aria-hidden="true">
    <span class="plek-icon">${plek.icon}</span>
    <span class="plek-pole"><span class="plek-flag"></span></span>
  </span>`;
}

// De rover zelf, ook voor op de basis.
export const roverSvg = `<svg class="rover-art" viewBox="0 0 64 48" aria-hidden="true">
  <path d="M40 6 V18" stroke="#c9cde8" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="40" cy="5" r="4" fill="#ffcc33"/>
  <rect x="10" y="18" width="44" height="14" rx="4" fill="#f4f1ff"/>
  <rect x="16" y="21" width="12" height="7" rx="2" fill="#3a6fd8"/>
  <rect x="6" y="30" width="52" height="5" rx="2" fill="#9aa0c8"/>
  <circle cx="14" cy="40" r="6" fill="#3b4080" stroke="#c9cde8" stroke-width="2"/>
  <circle cx="32" cy="40" r="6" fill="#3b4080" stroke="#c9cde8" stroke-width="2"/>
  <circle cx="50" cy="40" r="6" fill="#3b4080" stroke="#c9cde8" stroke-width="2"/>
</svg>`;
