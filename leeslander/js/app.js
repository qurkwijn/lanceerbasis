import { playRound, starsHtml } from '../../shared/js/game.js';
import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml } from '../../shared/js/util.js';
import { MANEN, landerSvg, moonSvg, setPhase } from './manen.js';

const APP = 'leeslander';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (de manen), #/<maan> (niveau kiezen), #/<maan>/<niveau>
// (oefenen). Naam en groep kies je op de Lanceerbasis; zonder profiel ga je
// daarheen en kom je daarna hier terug.
function route() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (!getProfile()) return location.replace(startUrl(APP));
  const [id, levelId] = location.hash.replace(/^#\/?/, '').split('/');
  const moon = MANEN.find((m) => m.id === id);
  if (!moon || moonState(moon).state !== 'open') return showMoons();
  const level = levelsFor(moon).find((l) => l.id === levelId);
  if (!level) return showMoon(moon);
  showGame(moon, level);
}

const levelKey = (moon, level) => `${moon.id}-${level.id}`;
const levelsFor = (moon) => moon.module.levels.filter((l) => l.groups.includes(getProfile().groep));
const moonStars = (moon) => levelsFor(moon).reduce((sum, l) => sum + getStars(levelKey(moon, l)), 0);

// Net als bij de planeten: open voor jouw groep, op slot voor een hogere groep,
// en weg als het alleen voor een lagere groep is.
function moonState(moon) {
  if (levelsFor(moon).length) return { state: 'open' };
  const from = Math.min(...moon.module.levels.flatMap((l) => l.groups));
  return from > getProfile().groep ? { state: 'locked', from } : { state: 'hidden' };
}

// Elke verdiende ster maakt de maan een stukje voller.
const phaseFor = (moon) => {
  const max = levelsFor(moon).length * 3;
  return max ? moonStars(moon) / max : 0;
};

function showMoons() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Leeslander</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Lees goed en maak de manen vol!</p>
      <ol class="moon-path">
        ${MANEN.filter((m) => moonState(m).state !== 'hidden').map((m) => {
          const { state, from } = moonState(m);
          const inner = `
            ${moonSvg(m, state === 'open' ? phaseFor(m) : 0, 96)}
            <span class="moon-label">
              <span class="moon-name">${m.name}</span>
              <span class="moon-sub">${m.sub}</span>
              <span class="moon-sub">${state === 'open'
                ? `<span class="star filled">★</span> ${moonStars(m)} / ${levelsFor(m).length * 3}`
                : `🔒 Vanaf groep ${from}`}</span>
            </span>`;
          return `<li>${state === 'open'
            ? `<a class="moon-link" href="#/${m.id}">${inner}</a>`
            : `<div class="moon-link locked" aria-disabled="true">${inner}</div>`}</li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showMoon(moon) {
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de manen">←</a>
        <h1>${moon.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="moon-hero">${moonSvg(moon, phaseFor(moon), 150)}</div>
      <p class="moon-hero-sub">${moon.sub}</p>
      <p class="intro">${moon.module.intro}</p>
      <div class="levels">
        ${levelsFor(moon).map((l) => `
          <a class="level-card" href="#/${moon.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(moon, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

// Tijdens het oefenen groeit de maan bij elke vraag, tot hij vol is.
function showGame(moon, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => moon.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${moon.id}`,
    progress: {
      html: `<span class="moon-progress">${moonSvg(moon, 0, 40)}</span><span class="moon-progress-name">${moon.name}</span>`,
      update(el, done) {
        setPhase(el.querySelector('svg'), done);
      },
    },
    onStars: (stars) => saveStars(levelKey(moon, level), stars),
    result: () => ({
      art: `<div class="moon-result">${moonSvg(moon, 1, 170)}<span class="moon-lander">${landerSvg}</span></div>`,
      title: `${escapeHtml(getProfile().name)} is geland op de ${moon.name}!`,
      actions: [
        { href: `#/${moon.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Naar de manen' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Leeslander');
window.addEventListener('hashchange', route);
route();
