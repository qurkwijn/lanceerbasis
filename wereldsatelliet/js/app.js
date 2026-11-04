import { playRound, starsHtml } from '../../shared/js/game.js';
import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml } from '../../shared/js/util.js';
import { KAARTEN, kaartHtml, satellietSvg } from './kaarten.js';

const APP = 'wereldsatelliet';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (de kaarten), #/<kaart> (niveau kiezen), #/<kaart>/<niveau>
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
  const kaart = KAARTEN.find((p) => p.id === id);
  if (!kaart || !isOpen(kaart)) return showKaarten();
  const level = levelsFor(kaart).find((l) => l.id === levelId);
  if (!level) return showKaart(kaart);
  showGame(kaart, level);
}

const levelKey = (kaart, level) => `${kaart.id}-${level.id}`;
const levelsFor = (kaart) => kaart.module.levels.filter((l) => l.groups.includes(getProfile().groep));
const kaartStars = (kaart) => levelsFor(kaart).reduce((sum, l) => sum + getStars(levelKey(kaart, l)), 0);

// Je ziet alleen wat bij jouw groep hoort, zodat de lijst kort blijft.
const isOpen = (kaart) => levelsFor(kaart).length > 0;

const phaseFor = (kaart) => {
  const max = levelsFor(kaart).length * 3;
  return max ? kaartStars(kaart) / max : 0;
};

function showKaarten() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Wereldsatelliet</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Kijk vanuit de ruimte naar Nederland!</p>
      <ol class="kaart-path">
        ${KAARTEN.filter(isOpen).map((p) => {
          const inner = `
            ${kaartHtml(p, phaseFor(p))}
            <span class="kaart-label">
              <span class="kaart-name">${p.name}</span>
              <span class="kaart-sub">${p.sub}</span>
              <span class="kaart-sub"><span class="star filled">★</span> ${kaartStars(p)} / ${levelsFor(p).length * 3}</span>
            </span>`;
          return `<li><a class="kaart-link" href="#/${p.id}">${inner}</a></li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showKaart(kaart) {
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de kaarten">←</a>
        <h1>${kaart.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="kaart-hero">${kaartHtml(kaart, phaseFor(kaart), 150)}</div>
      <p class="intro">${kaart.module.intro}</p>
      <div class="levels">
        ${levelsFor(kaart).map((l) => `
          <a class="level-card" href="#/${kaart.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(kaart, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

// Tijdens het oefenen vliegt de satelliet over zijn baan naar de kaart.
function showGame(kaart, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => kaart.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${kaart.id}`,
    progress: {
      html: `
        <div class="track sat-track">
          <span class="track-line"><span class="track-fill"></span><span class="track-sat">${satellietSvg}</span></span>
          <span class="track-goal" aria-hidden="true">${kaart.icon}</span>
        </div>`,
      update(el, done) {
        el.querySelector('.track').style.setProperty('--progress', done);
      },
    },
    onStars: (stars) => saveStars(levelKey(kaart, level), stars),
    result: () => ({
      art: `<div class="kaart-result">${kaartHtml(kaart, 1, 140)}</div>`,
      title: `${escapeHtml(getProfile().name)} heeft de kaart ${kaart.name.toLowerCase()} af!`,
      actions: [
        { href: `#/${kaart.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Naar de kaarten' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Wereldsatelliet');
window.addEventListener('hashchange', route);
route();
