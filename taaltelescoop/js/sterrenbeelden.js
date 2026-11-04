import beer from './sterrenbeelden/beer.js';
import haai from './sterrenbeelden/haai.js';
import hond from './sterrenbeelden/hond.js';
import ijsbeer from './sterrenbeelden/ijsbeer.js';
import kameel from './sterrenbeelden/kameel.js';
import kat from './sterrenbeelden/kat.js';
import maan from './sterrenbeelden/maan.js';
import muis from './sterrenbeelden/muis.js';
import nachtuil from './sterrenbeelden/nachtuil.js';
import slang from './sterrenbeelden/slang.js';
import zwaan from './sterrenbeelden/zwaan.js';
import citroen from './sterrenbeelden/citroen.js';
import kiwi from './sterrenbeelden/kiwi.js';
import papegaai from './sterrenbeelden/papegaai.js';
import paraplu from './sterrenbeelden/paraplu.js';
import zwaluw from './sterrenbeelden/zwaluw.js';
import { herhaal } from '../../shared/js/herhaal.js';

// Elk sterrenbeeld is een spellingonderdeel en heet naar een woord dat erbij hoort.
// Een sterrenbeeld heeft precies 10 sterren, één per vraag in een ronde.
// `stars` zijn punten in een vlak van 100 bij 100, `lines` verbinden twee
// sterren (op volgorde in de lijst, vanaf 0). De volgorde volgt ongeveer de
// spellingcategorieën van Staal, groep voor groep.
export const STERRENBEELDEN = [
  {
    id: 'kat', name: 'De Kat', sub: 'Hakken en plakken', module: kat,
    stars: [[28, 8], [36, 26], [54, 26], [60, 8], [45, 40], [30, 64], [34, 90], [64, 90], [70, 62], [92, 40]],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [2, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 4], [8, 9]],
  },
  {
    id: 'maan', name: 'De Maan', sub: 'Kort of lang', module: maan,
    stars: [[62, 8], [40, 14], [24, 32], [18, 54], [26, 76], [46, 90], [70, 92], [46, 72], [38, 52], [46, 28]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]],
  },
  {
    id: 'slang', name: 'De Slang', sub: 'ng of nk', module: slang,
    stars: [[8, 84], [22, 70], [38, 76], [52, 64], [56, 46], [44, 32], [50, 16], [66, 8], [82, 12], [92, 24]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  {
    id: 'nachtuil', name: 'De Nachtuil', sub: 'Luchtwoorden', module: nachtuil,
    stars: [[28, 8], [72, 8], [36, 30], [64, 30], [22, 52], [78, 52], [30, 82], [70, 82], [50, 94], [50, 44]],
    lines: [[0, 2], [1, 3], [2, 3], [2, 9], [3, 9], [0, 4], [1, 5], [4, 6], [5, 7], [6, 8], [7, 8]],
  },
  {
    id: 'beer', name: 'De Beer', sub: 'eer, oor, eur, eel', module: beer,
    stars: [[8, 34], [22, 24], [30, 10], [42, 30], [70, 24], [92, 36], [88, 74], [68, 54], [40, 56], [34, 80]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [8, 3]],
  },
  {
    id: 'haai', name: 'De Haai', sub: 'aai, ooi, oei, eeuw', module: haai,
    stars: [[6, 52], [30, 42], [46, 12], [58, 40], [80, 46], [96, 24], [88, 52], [96, 76], [60, 64], [28, 62]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4], [4, 8], [8, 9], [9, 0]],
  },
  {
    id: 'hond', name: 'De Hond', sub: 'd of t aan het eind', module: hond,
    stars: [[18, 16], [30, 26], [10, 34], [38, 44], [66, 46], [88, 28], [76, 82], [56, 66], [36, 86], [34, 62]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [6, 7], [7, 9], [9, 8], [3, 9]],
  },
  {
    id: 'ijsbeer', name: 'De IJsbeer', sub: 'ei/ij en au/ou', module: ijsbeer,
    stars: [[8, 46], [22, 36], [26, 24], [46, 30], [68, 32], [88, 40], [82, 72], [56, 56], [32, 72], [20, 54]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [7, 3]],
  },
  {
    id: 'zwaan', name: 'De Zwaan', sub: 'be-, ver-, -ig en -lijk', module: zwaan,
    stars: [[20, 16], [8, 24], [28, 34], [30, 56], [92, 38], [84, 62], [62, 44], [66, 86], [38, 82], [50, 66]],
    lines: [[1, 0], [0, 2], [2, 3], [3, 8], [8, 7], [7, 5], [5, 4], [4, 6], [6, 3], [6, 9], [9, 5]],
  },
  {
    id: 'kameel', name: 'De Kameel', sub: 'Klankgroepen', module: kameel,
    stars: [[6, 34], [16, 22], [24, 44], [40, 22], [54, 34], [68, 20], [86, 38], [84, 90], [62, 56], [32, 90]],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [6, 8], [8, 2], [2, 9]],
  },
  {
    id: 'muis', name: 'Het Muisje', sub: 'Verkleinwoorden', module: muis,
    stars: [[6, 28], [18, 50], [34, 68], [48, 56], [66, 48], [76, 30], [92, 52], [78, 70], [62, 86], [42, 86]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 2]],
  },
  {
    id: 'kiwi', name: 'De Kiwi', sub: 'Kilowoorden', module: kiwi,
    stars: [[6, 52], [20, 44], [34, 28], [56, 22], [76, 30], [88, 50], [78, 70], [56, 76], [44, 94], [64, 94]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1], [7, 8], [6, 9]],
  },
  {
    id: 'paraplu', name: 'De Paraplu', sub: "Komma-s: 's morgens, oma's", module: paraplu,
    stars: [[8, 46], [20, 26], [40, 12], [60, 12], [80, 26], [92, 46], [50, 46], [50, 68], [50, 88], [38, 92]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [6, 7], [7, 8], [8, 9]],
  },
  {
    id: 'citroen', name: 'De Citroen', sub: 'c: cent of cola', module: citroen,
    stars: [[6, 50], [20, 32], [40, 20], [62, 20], [82, 32], [94, 50], [82, 68], [62, 80], [40, 80], [20, 68]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0]],
  },
  {
    id: 'papegaai', name: 'De Papegaai', sub: 'Politie en tropisch', module: papegaai,
    stars: [[30, 12], [46, 6], [56, 18], [46, 32], [34, 24], [42, 52], [48, 72], [54, 96], [66, 90], [28, 62]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [3, 5], [5, 6], [6, 7], [6, 8], [5, 9]],
  },
  {
    id: 'zwaluw', name: 'De Zwaluw', sub: 'uw en gids', module: zwaluw,
    stars: [[6, 30], [28, 40], [50, 46], [72, 40], [94, 30], [50, 28], [50, 64], [38, 92], [62, 92], [50, 76]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 2], [2, 6], [6, 9], [9, 7], [9, 8]],
  },
  {
    id: 'grote-beer', name: 'De Grote Beer', sub: 'Herhalen', module: herhaal(() => STERRENBEELDEN, {
      from: [4], intro: 'Alle spellingcategorieën uit de vorige groep door elkaar. Op school herhalen ze die ook elke dag!',
    }),
    stars: [[6, 30], [22, 26], [36, 32], [48, 42], [48, 62], [74, 66], [78, 44], [42, 88], [80, 90], [94, 30]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3], [4, 7], [5, 8], [6, 9]],
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
