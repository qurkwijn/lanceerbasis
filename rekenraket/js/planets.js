import tellen from './planets/tellen.js';
import vergelijken from './planets/vergelijken.js';
import splitsen from './planets/splitsen.js';
import harten from './planets/harten.js';
import dubbelen from './planets/dubbelen.js';
import plusmin from './planets/plusmin.js';
import getallenlijn from './planets/getallenlijn.js';
import tientallen from './planets/tientallen.js';
import tafels from './planets/tafels.js';
import delen from './planets/delen.js';
import klok from './planets/klok.js';
import kalender from './planets/kalender.js';
import geld from './planets/geld.js';
import meten from './planets/meten.js';
import verhaaltjes from './planets/verhaaltjes.js';
import patronen from './planets/patronen.js';
import snelrekenen from './planets/snelrekenen.js';

// Elke planeet is een rekenonderdeel, ongeveer van makkelijk naar moeilijk.
// Welke niveaus je ziet, hangt af van je groep (zie `groups` per niveau).
export const PLANETS = [
  { id: 'tellen', name: 'Tellen', colors: ['#ffd3a8', '#f08a4b'], module: tellen },
  { id: 'meer-minder', name: 'Meer of minder', colors: ['#b8f5a0', '#4caf50'], ring: true, module: vergelijken },
  { id: 'splitsen', name: 'Splitsen', colors: ['#ffb86b', '#e8476a'], module: splitsen },
  { id: 'verliefde-harten', name: 'Verliefde harten', colors: ['#ffb3c8', '#e83e7a'], module: harten },
  { id: 'dubbelen', name: 'Dubbelen', colors: ['#ffe9a0', '#d9a520'], module: dubbelen },
  { id: 'plus-min', name: 'Plus en min', colors: ['#8af0b0', '#2a9d6a'], module: plusmin },
  { id: 'getallenlijn', name: 'Getallenlijn', colors: ['#8af5e8', '#1f8f9a'], ring: true, module: getallenlijn },
  { id: 'tientallen', name: 'Tientallen en eenheden', colors: ['#c0d4ff', '#4a63c8'], module: tientallen },
  { id: 'tafels', name: 'Tafels', colors: ['#d2b0ff', '#7a4fd6'], ring: true, module: tafels },
  { id: 'delen', name: 'Eerlijk delen', colors: ['#ffc4e1', '#c2549a'], module: delen },
  { id: 'klok', name: 'Klokkijken', colors: ['#9ad6ff', '#3a6fd8'], module: klok },
  { id: 'kalender', name: 'Kalender', colors: ['#ffcfa0', '#d9663a'], ring: true, module: kalender },
  { id: 'geld', name: 'Rekenen met geld', colors: ['#ffe68a', '#e09a20'], module: geld },
  { id: 'meten', name: 'Meten en wegen', colors: ['#d8e8a0', '#7d9a2a'], module: meten },
  { id: 'verhaaltjes', name: 'Verhaaltjessommen', colors: ['#f0c8ff', '#9b4fd6'], module: verhaaltjes },
  { id: 'patronen', name: 'Vormen en patronen', colors: ['#a8f0ff', '#2a8fd6'], ring: true, module: patronen },
  { id: 'snelrekenen', name: 'Snelrekenen', colors: ['#ff9a9a', '#d62a2a'], module: snelrekenen },
];
