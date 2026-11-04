import { playRound, starsHtml } from '../../shared/js/game.js';
import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml } from '../../shared/js/util.js';
import { PLEKKEN, plekHtml, roverSvg } from './plekken.js';

const APP = 'meetrover';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (Mars), #/<plek> (niveau kiezen), #/<plek>/<niveau> (oefenen).
// Naam en groep kies je op de Lanceerbasis; zonder profiel ga je daarheen en
// kom je daarna hier terug.
function route() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (!getProfile()) return location.replace(startUrl(APP));
  const [id, levelId] = location.hash.replace(/^#\/?/, '').split('/');
  const plek = PLEKKEN.find((p) => p.id === id);
  if (!plek || !isOpen(plek)) return showMars();
  const level = levelsFor(plek).find((l) => l.id === levelId);
  if (!level) return showPlek(plek);
  showGame(plek, level);
}

const levelKey = (plek, level) => `${plek.id}-${level.id}`;
const levelsFor = (plek) => plek.module.levels.filter((l) => l.groups.includes(getProfile().groep));
const plekStars = (plek) => levelsFor(plek).reduce((sum, l) => sum + getStars(levelKey(plek, l)), 0);

// Je ziet alleen wat bij jouw groep hoort, zodat de lijst kort blijft.
const isOpen = (plek) => levelsFor(plek).length > 0;

const phaseFor = (plek) => {
  const max = levelsFor(plek).length * 3;
  return max ? plekStars(plek) / max : 0;
};

function showMars() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Meetrover</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Rij over Mars en zet overal je vlag!</p>
      <ol class="plek-path">
        ${PLEKKEN.filter(isOpen).map((p) => {
          const inner = `
            ${plekHtml(p, phaseFor(p))}
            <span class="plek-label">
              <span class="plek-name">${p.name}</span>
              <span class="plek-sub">${p.sub}</span>
              <span class="plek-sub"><span class="star filled">★</span> ${plekStars(p)} / ${levelsFor(p).length * 3}</span>
            </span>`;
          return `<li><a class="plek-link" href="#/${p.id}">${inner}</a></li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showPlek(plek) {
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar Mars">←</a>
        <h1>${plek.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="plek-hero">${plekHtml(plek, phaseFor(plek), 150)}</div>
      <p class="intro">${plek.module.intro}</p>
      <div class="levels">
        ${levelsFor(plek).map((l) => `
          <a class="level-card" href="#/${plek.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(plek, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

// Tijdens het oefenen rijdt de rover over een spoor naar de plek.
function showGame(plek, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => plek.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${plek.id}`,
    progress: {
      html: `
        <div class="track rover-track">
          <span class="track-line"><span class="track-fill"></span><span class="track-rover">${roverSvg}</span></span>
          <span class="track-goal" aria-hidden="true">${plek.icon}</span>
        </div>`,
      update(el, done) {
        el.querySelector('.track').style.setProperty('--progress', done);
      },
    },
    onStars: (stars) => saveStars(levelKey(plek, level), stars),
    result: () => ({
      art: `<div class="plek-result">${plekHtml(plek, 1, 140)}</div>`,
      title: `${escapeHtml(getProfile().name)} zet de vlag bij ${plek.name.toLowerCase()}!`,
      actions: [
        { href: `#/${plek.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Terug naar Mars' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Meetrover');
window.addEventListener('hashchange', route);
route();
