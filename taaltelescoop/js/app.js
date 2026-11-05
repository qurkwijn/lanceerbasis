import { ROUND } from '../../shared/js/game.js';
import { startVehicle } from '../../shared/js/vehicle.js';
import { STERRENBEELDEN, lightUp, skySvg } from './sterrenbeelden.js';

// Elke verdiende ster laat een deel van het sterrenbeeld oplichten.
const lit = (sb, phase) => Math.round(phase * sb.stars.length);

startVehicle({
  id: 'taaltelescoop',
  name: 'Taaltelescoop',
  items: STERRENBEELDEN,
  cls: 'sky',
  mapIntro: 'Kijk door de telescoop en laat de sterrenbeelden stralen!',
  mapName: 'de sterrenhemel',
  art: (sb, phase, size) => skySvg(sb, lit(sb, phase), size),
  mapSize: 104,
  heroSize: 170,
  heroSub: true,
  // Tijdens het oefenen licht bij elke vraag een ster van het sterrenbeeld op.
  progress: (sb) => ({
    html: `<span class="sky-progress">${skySvg(sb, 0, 44)}</span><span class="sky-progress-name">${sb.name}</span>`,
    update(el, done) {
      lightUp(el.querySelector('svg'), sb, Math.round(done * ROUND));
    },
  }),
  resultArt: (sb) => `<div class="sky-result">${skySvg(sb, sb.stars.length, 200)}</div>`,
  resultTitle: (sb, name) => `${name} laat ${sb.name.replace(/^(De|Het) /, (w) => w.toLowerCase())} stralen!`,
});
