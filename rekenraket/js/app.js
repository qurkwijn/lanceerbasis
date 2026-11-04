import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { playRound, starsHtml } from '../../shared/js/game.js';
import { escapeHtml } from '../../shared/js/util.js';
import { PLANETS } from './planets.js';

const APP = 'rekenraket';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (kaart), #/<planeet> (niveau kiezen), #/<planeet>/<niveau>
// (oefenen). Naam en groep kies je op de Lanceerbasis; zonder profiel ga je
// daarheen en kom je daarna hier terug.
function route() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (!getProfile()) return location.replace(startUrl(APP));
  const [id, levelId] = location.hash.replace(/^#\/?/, '').split('/');
  const planet = PLANETS.find((p) => p.id === id);
  if (!planet || planetState(planet).state !== 'open') return showMap();
  const level = levelsFor(planet).find((l) => l.id === levelId);
  if (!level) return showPlanet(planet);
  showGame(planet, level);
}

const levelKey = (planet, level) => `${planet.id}-${level.id}`;
const levelsFor = (planet) => planet.module.levels.filter((l) => l.groups.includes(getProfile().groep));

// Een planeet met niveaus voor jouw groep is open. Is hij voor een hogere
// groep, dan zie je hem op slot ("Vanaf groep 4"). Planeten die alleen voor
// een lagere groep zijn, laten we weg.
function planetState(planet) {
  if (levelsFor(planet).length) return { state: 'open' };
  const from = Math.min(...planet.module.levels.flatMap((l) => l.groups));
  return from > getProfile().groep && !planet.module.review ? { state: 'locked', from } : { state: 'hidden' };
}

function planetBall(planet, size) {
  const [c1, c2] = planet.colors;
  return `<span class="planet${planet.ring ? ' ringed' : ''}" style="--c1:${c1};--c2:${c2};--size:${size}px"></span>`;
}

function planetStars(planet) {
  return levelsFor(planet).reduce((sum, l) => sum + getStars(levelKey(planet, l)), 0);
}

function showMap() {
  const sizes = [104, 88, 112, 84, 96, 92];
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Rekenraket</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Kies een planeet en vlieg erheen!</p>
      <ol class="planet-path">
        ${PLANETS.filter((p) => planetState(p).state !== 'hidden').map((p, i) => {
          const { state, from } = planetState(p);
          const inner = `
            ${planetBall(p, sizes[i % sizes.length])}
            <span class="planet-label">
              <span class="planet-name">${p.name}</span>
              <span class="planet-sub">${state === 'open'
                ? `<span class="star filled">★</span> ${planetStars(p)} / ${levelsFor(p).length * 3}`
                : `🔒 Vanaf groep ${from}`}</span>
            </span>`;
          return `<li>${state === 'open'
            ? `<a class="planet-link" href="#/${p.id}">${inner}</a>`
            : `<div class="planet-link locked" aria-disabled="true">${inner}</div>`}</li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showPlanet(planet) {
  const { module: mod } = planet;
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de kaart">←</a>
        <h1>${planet.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="planet-hero">${planetBall(planet, 150)}</div>
      <p class="intro">${mod.intro}</p>
      <div class="levels">
        ${levelsFor(planet).map((l) => `
          <a class="level-card" href="#/${planet.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(planet, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

function showGame(planet, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => planet.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${planet.id}`,
    goalHtml: planetBall(planet, 28),
    onStars: (stars) => saveStars(levelKey(planet, level), stars),
    result: () => ({
      art: `<div class="result-planet">${planetBall(planet, 140)}<span class="result-rocket" aria-hidden="true">🚀</span></div>`,
      title: `${escapeHtml(getProfile().name)} is geland op planeet ${planet.name}!`,
      actions: [
        { href: `#/${planet.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Naar de kaart' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Rekenraket');
window.addEventListener('hashchange', route);
route();
