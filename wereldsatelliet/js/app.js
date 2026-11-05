import { startVehicle, trackProgress } from '../../shared/js/vehicle.js';
import { KAARTEN, kaartHtml, satellietSvg } from './kaarten.js';

startVehicle({
  id: 'wereldsatelliet',
  name: 'Wereldsatelliet',
  items: KAARTEN,
  cls: 'kaart',
  mapIntro: 'Kijk vanuit de ruimte naar Nederland!',
  mapName: 'de kaarten',
  art: kaartHtml,
  heroSize: 150,
  // Tijdens het oefenen vliegt de satelliet over zijn baan naar de kaart.
  progress: (kaart) => trackProgress(satellietSvg, kaart.icon, 'sat'),
  resultArt: (kaart) => `<div class="kaart-result">${kaartHtml(kaart, 1, 140)}</div>`,
  resultTitle: (kaart, name) => `${name} heeft de kaart ${kaart.name.toLowerCase()} af!`,
});
