import { startVehicle, trackProgress } from '../../shared/js/vehicle.js';
import { SIGNALEN, dishSvg, signalSvg } from './signalen.js';

startVehicle({
  id: 'zinnenzender',
  name: 'Zinnenzender',
  items: SIGNALEN,
  cls: 'signal',
  mapIntro: 'Draai de schotel en vang alle signalen op!',
  mapName: 'de signalen',
  art: signalSvg,
  heroSize: 150,
  // Tijdens het oefenen gaat het berichtje van de schotel naar het signaal.
  progress: (sig) => trackProgress(dishSvg, signalSvg(sig, 1, 30), 'dish'),
  resultArt: (sig) => `<div class="signal-result">${signalSvg(sig, 1, 160)}</div>`,
  resultTitle: (sig, name) => `${name} heeft ${sig.name.toLowerCase()} opgevangen!`,
});
