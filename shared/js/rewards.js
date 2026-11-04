import { getProfile } from './profile.js';
import { load, save } from './store.js';

// Beste aantal sterren per app en per oefening, apart per groep, zodat
// kinderen uit verschillende groepen op één apparaat elkaars scores niet zien.
// Sleutels zien eruit als `rekenraket:g4:tellen-1`.
const groupPrefix = () => `g${getProfile()?.groep ?? 4}:`;
const starKey = (app, id) => `${app}:${groupPrefix()}${id}`;

export function getStars(app, id) {
  return load().stars?.[starKey(app, id)] ?? 0;
}

export function saveStars(app, id, stars) {
  const data = load();
  data.stars = data.stars || {};
  const key = starKey(app, id);
  if (stars <= (data.stars[key] || 0)) return;
  data.stars[key] = stars;
  save(data);
}

// Zonder `app` tellen we de sterren van alle apps op.
export function totalStars(app) {
  const group = groupPrefix();
  return Object.entries(load().stars || {})
    .filter(([key]) => {
      const [keyApp, keyGroup] = key.split(':');
      return `${keyGroup}:` === group && (!app || keyApp === app);
    })
    .reduce((sum, [, n]) => sum + n, 0);
}
