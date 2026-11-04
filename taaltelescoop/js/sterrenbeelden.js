import hond from './sterrenbeelden/hond.js';
import ijsbeer from './sterrenbeelden/ijsbeer.js';
import maan from './sterrenbeelden/maan.js';
import pauw from './sterrenbeelden/pauw.js';
import slang from './sterrenbeelden/slang.js';

// Elk sterrenbeeld is een taalonderdeel en heet naar een woord dat erbij hoort.
// Een sterrenbeeld heeft precies 10 sterren, één per vraag in een ronde.
// `stars` zijn punten in een vlak van 100 bij 100, `lines` verbinden twee
// sterren (op volgorde in de lijst, vanaf 0).
export const STERRENBEELDEN = [
  {
    id: 'maan', name: 'De Maan', sub: 'Kort of lang', module: maan,
    stars: [[62, 8], [40, 14], [24, 32], [18, 54], [26, 76], [46, 90], [70, 92], [46, 72], [38, 52], [46, 28]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]],
  },
  {
    id: 'ijsbeer', name: 'De IJsbeer', sub: 'ei of ij', module: ijsbeer,
    stars: [[8, 46], [22, 36], [26, 24], [46, 30], [68, 32], [88, 40], [82, 72], [56, 56], [32, 72], [20, 54]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [7, 3]],
  },
  {
    id: 'pauw', name: 'De Pauw', sub: 'au of ou', module: pauw,
    stars: [[56, 64], [50, 76], [50, 94], [12, 50], [20, 26], [34, 10], [50, 6], [66, 10], [80, 26], [88, 50]],
    lines: [[0, 1], [1, 2], [1, 3], [1, 6], [1, 9], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  {
    id: 'slang', name: 'De Slang', sub: 'ng of nk', module: slang,
    stars: [[8, 84], [22, 70], [38, 76], [52, 64], [56, 46], [44, 32], [50, 16], [66, 8], [82, 12], [92, 24]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  {
    id: 'hond', name: 'De Hond', sub: 'd of t aan het eind', module: hond,
    stars: [[18, 16], [30, 26], [10, 34], [38, 44], [66, 46], [88, 28], [76, 82], [56, 66], [36, 86], [34, 62]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [6, 7], [7, 9], [9, 8], [3, 9]],
  },
];

// Teken een sterrenbeeld. De eerste `lit` sterren lichten op; een lijn
// verschijnt zodra beide sterren aan staan.
export function skySvg(sb, lit = sb.stars.length, size = 100) {
  const on = (i) => i < lit;
  return `<svg class="sky-art" viewBox="-6 -6 112 112" width="${size}" height="${size}" aria-hidden="true">
    ${sb.lines.map(([a, b]) => {
      const [x1, y1] = sb.stars[a];
      const [x2, y2] = sb.stars[b];
      return `<line class="sky-line${on(a) && on(b) ? ' on' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join('')}
    ${sb.stars.map(([x, y], i) => `<circle class="sky-star${on(i) ? ' on' : ''}" cx="${x}" cy="${y}" r="${on(i) ? 4.5 : 3}"/>`).join('')}
  </svg>`;
}

// Zet de oplichtende sterren bij in een al getekend sterrenbeeld.
export function lightUp(svg, sb, lit) {
  svg.querySelectorAll('.sky-star').forEach((star, i) => {
    star.classList.toggle('on', i < lit);
    star.setAttribute('r', i < lit ? 4.5 : 3);
  });
  svg.querySelectorAll('.sky-line').forEach((line, i) => {
    const [a, b] = sb.lines[i];
    line.classList.toggle('on', a < lit && b < lit);
  });
}
