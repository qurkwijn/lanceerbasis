import provincies from './kaarten/provincies.js';
import richting from './kaarten/richting.js';
import steden from './kaarten/steden.js';
import water from './kaarten/water.js';

// De kaarten die de satelliet vanuit de ruimte maakt. Elke kaart is een stukje
// topografie; later komen er kaarten van Europa en de wereld bij. Hoe meer
// sterren, hoe verder de ring om de kaart dicht is.
export const KAARTEN = [
  { id: 'provincies', name: 'Provincies', sub: 'De 12 provincies', icon: '🗺️', color: '#8af0b0', module: provincies },
  { id: 'steden', name: 'Steden', sub: 'Hoofdsteden en grote steden', icon: '🏙️', color: '#ffb36b', module: steden },
  { id: 'water', name: 'Water en eilanden', sub: 'Zeeën, rivieren en TV TAS', icon: '🌊', color: '#9fd3ff', module: water },
  { id: 'richting', name: 'Windrichtingen', sub: 'Noord, oost, zuid en west', icon: '🧭', color: '#ffd76e', module: richting },
];

// Een kaart als rond fotootje met een ring eromheen. Bij `phase` 1 is de
// ring rond.
export function kaartHtml(kaart, phase = 0, size = 96) {
  return `<span class="kaart" style="--size:${size}px;--phase:${phase};--c:${kaart.color}" aria-hidden="true">
    <span class="kaart-icon">${kaart.icon}</span>
  </span>`;
}

// De satelliet zelf, ook voor op de basis.
export const satellietSvg = `<svg class="sat-art" viewBox="0 0 64 40" aria-hidden="true">
  <rect x="2" y="14" width="18" height="12" rx="2" fill="#3a6fd8"/>
  <rect x="44" y="14" width="18" height="12" rx="2" fill="#3a6fd8"/>
  <path d="M20 20 H44" stroke="#c9cde8" stroke-width="2"/>
  <rect x="24" y="10" width="16" height="20" rx="4" fill="#f4f1ff"/>
  <circle cx="32" cy="34" r="4" fill="#ffcc33"/>
</svg>`;
