import bouw from './manen/bouw.js';
import flits from './manen/flits.js';
import gek from './manen/gek.js';
import verhaal from './manen/verhaal.js';
import zinnen from './manen/zinnen.js';

// Elke maan is een stukje lezen. Hoe meer je oefent, hoe voller de maan.
// `craters` zijn [x, y, straal] in een vlak van 100 bij 100.
export const MANEN = [
  {
    id: 'flits', name: 'Flitsmaan', sub: 'Woorden flitsen', color: '#f5d76e', module: flits,
    craters: [[34, 30, 9], [62, 58, 12], [40, 72, 6], [70, 28, 5]],
  },
  {
    id: 'zinnen', name: 'Zinnenmaan', sub: 'Zin bij plaatje', color: '#9fd3ff', module: zinnen,
    craters: [[30, 44, 10], [64, 30, 7], [60, 68, 11], [42, 22, 4]],
  },
  {
    id: 'gek', name: 'Gekke maan', sub: 'Klopt het of is het gek?', color: '#ff9ecb', module: gek,
    craters: [[38, 36, 7], [66, 46, 10], [36, 68, 9], [58, 76, 4]],
  },
  {
    id: 'bouw', name: 'Bouwmaan', sub: 'Zinnen bouwen', color: '#ffb36b', module: bouw,
    craters: [[30, 34, 6], [56, 40, 12], [38, 66, 8], [70, 70, 5]],
  },
  {
    id: 'verhaal', name: 'Verhaalmaan', sub: 'Korte verhaaltjes', color: '#a8e6a1', module: verhaal,
    craters: [[44, 28, 8], [28, 56, 7], [62, 60, 11], [74, 36, 4]],
  },
];

// De schaduw over de maan. Bij `phase` 0 is hij donker, bij 1 vol. De maan
// groeit van rechts naar links, zoals een wassende maan.
function shadowPath(phase) {
  const rx = Math.abs(1 - 2 * phase) * 46;
  const sweep = phase > 0.5 ? 1 : 0;
  return `M50 4 A46 46 0 0 0 50 96 A${rx.toFixed(2)} 46 0 0 ${sweep} 50 4 Z`;
}

export function moonSvg(moon, phase = 1, size = 100) {
  return `<svg class="moon-art" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="${moon.color}"/>
    ${moon.craters.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(0, 0, 0, 0.12)"/>`).join('')}
    <path class="moon-shadow" d="${shadowPath(phase)}"/>
  </svg>`;
}

// Zet de maan in een al getekende maan bij.
export function setPhase(svg, phase) {
  svg.querySelector('.moon-shadow').setAttribute('d', shadowPath(phase));
}

// De maanlander, net als in de hangar op de basis.
export const landerSvg = `<svg class="lander-art" viewBox="36 112 48 48" aria-hidden="true">
  <path d="M44 150 38 158 M76 150 82 158 M50 146 46 158 M70 146 74 158" stroke="#c9cde8" stroke-width="3" stroke-linecap="round"/>
  <rect x="42" y="134" width="36" height="16" rx="3" fill="#e0a33a"/>
  <path d="M46 134 C46 114 74 114 74 134 Z" fill="#d8dcf2"/>
  <circle cx="60" cy="126" r="5" fill="#3a6fd8"/>
</svg>`;
