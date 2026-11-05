import { load, save } from './store.js';

// Voor deze groepen is er al iets te oefenen. De rest van de basisschool
// laten we alvast zien, maar die staat nog in aanbouw.
export const GROUPS = [3, 4, 5];
export const ALL_GROUPS = [3, 4, 5, 6, 7, 8];

// De landingspagina, gerekend vanaf deze map. Zo werkt het lokaal en op
// GitHub Pages, vanuit elke app.
export const HOME = new URL('../../', import.meta.url).href;

// Naar het startscherm om naam of groep te kiezen. Met `app` kom je daarna
// terug in die app.
export const startUrl = (app) => `${HOME}#/start${app ? `/${app}` : ''}`;

// Alleen een profiel met een naam en een groep die er is, telt. Anders kies
// je opnieuw op het startscherm.
export function getProfile() {
  const profile = load().profile;
  if (!profile || typeof profile.name !== 'string' || !profile.name || !GROUPS.includes(profile.groep)) return null;
  return { name: profile.name.slice(0, 20), groep: profile.groep };
}

// Geeft terug of het bewaren gelukt is.
export function saveProfile(profile) {
  const data = load();
  data.profile = profile;
  return save(data);
}
