import { playRound, starsHtml } from '../../shared/js/game.js';
import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml } from '../../shared/js/util.js';
import { SIGNALEN, dishSvg, signalSvg } from './signalen.js';

const APP = 'zinnenzender';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (de signalen), #/<signaal> (niveau kiezen), #/<signaal>/<niveau>
// (oefenen).
// Naam en groep kies je op de Lanceerbasis; zonder profiel ga je daarheen en
// kom je daarna hier terug.
function route() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (!getProfile()) return location.replace(startUrl(APP));
  const [id, levelId] = location.hash.replace(/^#\/?/, '').split('/');
  const sig = SIGNALEN.find((p) => p.id === id);
  if (!sig || signalState(sig).state !== 'open') return showSignals();
  const level = levelsFor(sig).find((l) => l.id === levelId);
  if (!level) return showSignal(sig);
  showGame(sig, level);
}

const levelKey = (sig, level) => `${sig.id}-${level.id}`;
const levelsFor = (sig) => sig.module.levels.filter((l) => l.groups.includes(getProfile().groep));
const signalStars = (sig) => levelsFor(sig).reduce((sum, l) => sum + getStars(levelKey(sig, l)), 0);

// Net als bij de planeten: open voor jouw groep, op slot voor een hogere groep,
// en weg als het alleen voor een lagere groep is.
function signalState(sig) {
  if (levelsFor(sig).length) return { state: 'open' };
  const from = Math.min(...sig.module.levels.flatMap((l) => l.groups));
  return from > getProfile().groep ? { state: 'locked', from } : { state: 'hidden' };
}

const phaseFor = (sig) => {
  const max = levelsFor(sig).length * 3;
  return max ? signalStars(sig) / max : 0;
};

function showSignals() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Zinnenzender</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Draai de schotel en vang alle signalen op!</p>
      <ol class="signal-path">
        ${SIGNALEN.filter((p) => signalState(p).state !== 'hidden').map((p) => {
          const { state, from } = signalState(p);
          const inner = `
            ${signalSvg(p, state === 'open' ? phaseFor(p) : 0)}
            <span class="signal-label">
              <span class="signal-name">${p.name}</span>
              <span class="signal-sub">${p.sub}</span>
              <span class="signal-sub">${state === 'open'
                ? `<span class="star filled">★</span> ${signalStars(p)} / ${levelsFor(p).length * 3}`
                : `🔒 Vanaf groep ${from}`}</span>
            </span>`;
          return `<li>${state === 'open'
            ? `<a class="signal-link" href="#/${p.id}">${inner}</a>`
            : `<div class="signal-link locked" aria-disabled="true">${inner}</div>`}</li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showSignal(sig) {
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de signalen">←</a>
        <h1>${sig.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="signal-hero">${signalSvg(sig, phaseFor(sig), 150)}</div>
      <p class="intro">${sig.module.intro}</p>
      <div class="levels">
        ${levelsFor(sig).map((l) => `
          <a class="level-card" href="#/${sig.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(sig, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

// Tijdens het oefenen gaat het berichtje van de schotel naar het signaal.
function showGame(sig, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => sig.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${sig.id}`,
    progress: {
      html: `
        <div class="track dish-track">
          <span class="track-line"><span class="track-fill"></span><span class="track-dish">${dishSvg}</span></span>
          <span class="track-goal">${signalSvg(sig, 1, 30)}</span>
        </div>`,
      update(el, done) {
        el.querySelector('.track').style.setProperty('--progress', done);
      },
    },
    onStars: (stars) => saveStars(levelKey(sig, level), stars),
    result: () => ({
      art: `<div class="signal-result">${signalSvg(sig, 1, 160)}</div>`,
      title: `${escapeHtml(getProfile().name)} heeft ${sig.name.toLowerCase()} opgevangen!`,
      actions: [
        { href: `#/${sig.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Naar de signalen' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Zinnenzender');
window.addEventListener('hashchange', route);
route();
