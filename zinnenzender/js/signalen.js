import alfabet from './signalen/alfabet.js';
import hoofdletters from './signalen/hoofdletters.js';
import meervoud from './signalen/meervoud.js';
import woordenschat from './signalen/woordenschat.js';

// De signalen die de Zinnenzender opvangt. Elk signaal is een stukje
// taalkennis: woorden, zinnen en later ook woordsoorten en ontleden.
// Hoe meer sterren, hoe meer golven het signaal heeft.
export const SIGNALEN = [
  { id: 'alfabet', name: 'Het alfabet', sub: 'Van a tot z', color: '#ffcc33', module: alfabet },
  { id: 'hoofdletters', name: 'Hoofdletter en punt', sub: 'Zo schrijf je een zin', color: '#ff8fa3', module: hoofdletters },
  { id: 'woordenschat', name: 'Woordenschat', sub: 'Tegenstellingen en meer', color: '#8af0b0', module: woordenschat },
  { id: 'meervoud', name: 'Meervoud', sub: 'Eén kat, twee katten', color: '#9fd3ff', module: meervoud },
];

const WAVES = 4;

// Een signaal: een bolletje met golven eromheen. Bij `phase` 0 is alleen het
// bolletje aan, bij 1 alle golven.
export function signalSvg(signal, phase = 0, size = 96) {
  const on = Math.round(phase * WAVES);
  const waves = Array.from({ length: WAVES }, (_, i) => {
    const r = 16 + i * 10;
    return `<path class="wave${i < on ? ' on' : ''}" d="M${50 - r * 0.7} ${50 - r * 0.7} A${r} ${r} 0 0 1 ${50 + r * 0.7} ${50 - r * 0.7}"
      style="--c:${signal.color}"/>
      <path class="wave${i < on ? ' on' : ''}" d="M${50 + r * 0.7} ${50 + r * 0.7} A${r} ${r} 0 0 1 ${50 - r * 0.7} ${50 + r * 0.7}"
      style="--c:${signal.color}"/>`;
  }).join('');
  return `<svg class="signal-art" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    ${waves}
    <circle cx="50" cy="50" r="9" fill="${signal.color}"/>
  </svg>`;
}

// De schotelantenne, net als op de basis.
export const dishSvg = `<svg class="dish-art" viewBox="0 0 48 48" aria-hidden="true">
  <path d="M8 10 A22 22 0 0 0 38 40 Z" fill="#d8dcf2"/>
  <path d="M23 25 L34 14" stroke="#c9cde8" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="35" cy="13" r="3.5" fill="#ffcc33"/>
  <path d="M22 34 L18 46 H32 L28 34" fill="#3b4080"/>
</svg>`;
