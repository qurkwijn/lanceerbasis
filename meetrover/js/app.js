import { startVehicle, trackProgress } from '../../shared/js/vehicle.js';
import { PLEKKEN, plekHtml, roverSvg } from './plekken.js';

startVehicle({
  id: 'meetrover',
  name: 'Meetrover',
  items: PLEKKEN,
  cls: 'plek',
  mapIntro: 'Rij over Mars en zet overal je vlag!',
  mapName: 'Mars',
  art: plekHtml,
  heroSize: 150,
  // Tijdens het oefenen rijdt de rover over een spoor naar de plek.
  progress: (plek) => trackProgress(roverSvg, plek.icon, 'rover'),
  resultArt: (plek) => `<div class="plek-result">${plekHtml(plek, 1, 140)}</div>`,
  resultTitle: (plek, name) => `${name} zet de vlag bij ${plek.name.toLowerCase()}!`,
});
