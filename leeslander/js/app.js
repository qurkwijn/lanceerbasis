import { startVehicle } from '../../shared/js/vehicle.js';
import { MANEN, landerSvg, moonSvg, setPhase } from './manen.js';

startVehicle({
  id: 'leeslander',
  name: 'Leeslander',
  items: MANEN,
  cls: 'moon',
  mapIntro: 'Lees goed en maak de manen vol!',
  mapName: 'de manen',
  art: moonSvg,
  heroSize: 150,
  heroSub: true,
  // Tijdens het oefenen groeit de maan bij elke vraag, tot hij vol is.
  progress: (moon) => ({
    html: `<span class="moon-progress">${moonSvg(moon, 0, 40)}</span><span class="moon-progress-name">${moon.name}</span>`,
    update(el, done) {
      setPhase(el.querySelector('svg'), done);
    },
  }),
  resultArt: (moon) => `<div class="moon-result">${moonSvg(moon, 1, 170)}<span class="moon-lander">${landerSvg}</span></div>`,
  resultTitle: (moon, name) => `${name} is geland op de ${moon.name}!`,
});
