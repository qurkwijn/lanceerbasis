import { startVehicle } from '../../shared/js/vehicle.js';
import { PLANETS } from './planets.js';

const SIZES = [104, 88, 112, 84, 96, 92];

function planetBall(planet, size) {
  const [c1, c2] = planet.colors;
  return `<span class="planet${planet.ring ? ' ringed' : ''}" style="--c1:${c1};--c2:${c2};--size:${size}px"></span>`;
}

startVehicle({
  id: 'rekenraket',
  name: 'Rekenraket',
  items: PLANETS,
  cls: 'planet',
  mapIntro: 'Kies een planeet en vlieg erheen!',
  mapName: 'de kaart',
  art: (planet, phase, size) => planetBall(planet, size),
  // Op de kaart zijn de planeten verschillend groot.
  mapSize: (i) => SIZES[i % SIZES.length],
  heroSize: 150,
  goal: (planet) => planetBall(planet, 28),
  resultArt: (planet) => `<div class="result-planet">${planetBall(planet, 140)}<span class="result-rocket" aria-hidden="true">🚀</span></div>`,
  resultTitle: (planet, name) => `${name} is geland op planeet ${planet.name}!`,
});
