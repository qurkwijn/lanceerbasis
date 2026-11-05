import { playRound, ROUND, starsHtml } from '../../shared/js/game.js';
import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml } from '../../shared/js/util.js';
import { STERRENBEELDEN, lightUp, skySvg } from './sterrenbeelden.js';

const APP = 'taaltelescoop';
const app = document.getElementById('app');

const getStars = (id) => rewards.getStars(APP, id);
const saveStars = (id, stars) => rewards.saveStars(APP, id, stars);
const totalStars = () => rewards.totalStars(APP);

let cleanup = null;

// Routes: #/ (de sterrenhemel), #/<sterrenbeeld> (niveau kiezen),
// #/<sterrenbeeld>/<niveau> (oefenen). Naam en groep kies je op de
// Lanceerbasis; zonder profiel ga je daarheen en kom je daarna hier terug.
function route() {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
  if (!getProfile()) return location.replace(startUrl(APP));
  const [id, levelId] = location.hash.replace(/^#\/?/, '').split('/');
  const sb = STERRENBEELDEN.find((s) => s.id === id);
  if (!sb || !isOpen(sb)) return showSky();
  const level = levelsFor(sb).find((l) => l.id === levelId);
  if (!level) return showSterrenbeeld(sb);
  showGame(sb, level);
}

const levelKey = (sb, level) => `${sb.id}-${level.id}`;
const levelsFor = (sb) => sb.module.levels.filter((l) => l.groups.includes(getProfile().groep));
const sbStars = (sb) => levelsFor(sb).reduce((sum, l) => sum + getStars(levelKey(sb, l)), 0);

// Je ziet alleen wat bij jouw groep hoort, zodat de lijst kort blijft.
const isOpen = (sb) => levelsFor(sb).length > 0;

// Op de hemel zie je meteen hoe ver je bent: elke verdiende ster laat een
// deel van het sterrenbeeld oplichten.
const litFor = (sb) => {
  const max = levelsFor(sb).length * 3;
  return max ? Math.round((sbStars(sb) / max) * sb.stars.length) : 0;
};

function showSky() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
        <h1 class="logo">Taaltelescoop</h1>
        <div class="star-count"><span aria-hidden="true">★ ${totalStars()}</span><span class="sr-only">${totalStars()} sterren verdiend</span></div>
      </header>
      <a class="player-chip" href="${startUrl(APP)}" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Kijk door de telescoop en laat de sterrenbeelden stralen!</p>
      <ol class="sky-path">
        ${STERRENBEELDEN.filter(isOpen).map((s) => {
          const inner = `
            ${skySvg(s, litFor(s), 104)}
            <span class="sky-label">
              <span class="sky-name">${s.name}</span>
              <span class="sky-sub">${s.sub}</span>
              <span class="sky-sub"><span class="star filled">★</span> ${sbStars(s)} / ${levelsFor(s).length * 3}</span>
            </span>`;
          return `<li><a class="sky-link" href="#/${s.id}">${inner}</a></li>`;
        }).join('')}
      </ol>
      ${INFO_FOOTER}
    </div>`;
}

function showSterrenbeeld(sb) {
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de sterrenhemel">←</a>
        <h1>${sb.name}</h1>
        <span class="groep-badge">Groep ${getProfile().groep}</span>
      </header>
      <div class="sky-hero">${skySvg(sb, litFor(sb), 170)}</div>
      <p class="sky-hero-sub">${sb.sub}</p>
      <p class="intro">${sb.module.intro}</p>
      <div class="levels">
        ${levelsFor(sb).map((l) => `
          <a class="level-card" href="#/${sb.id}/${l.id}">
            <span class="level-name">${l.name}</span>
            <span class="level-hint">${l.hint}</span>
            <span class="level-stars">${starsHtml(getStars(levelKey(sb, l)))}</span>
          </a>`).join('')}
      </div>
      ${INFO_FOOTER}
    </div>`;
}

// Tijdens het oefenen licht bij elke vraag een ster van het sterrenbeeld op.
function showGame(sb, level) {
  cleanup = playRound(app, {
    level,
    makeQuestion: () => sb.module.makeQuestion(level.id, getProfile()),
    quitHref: `#/${sb.id}`,
    progress: {
      html: `<span class="sky-progress">${skySvg(sb, 0, 44)}</span><span class="sky-progress-name">${sb.name}</span>`,
      update(el, done) {
        lightUp(el.querySelector('svg'), sb, Math.round(done * ROUND));
      },
    },
    onStars: (stars) => saveStars(levelKey(sb, level), stars),
    result: () => ({
      art: `<div class="sky-result">${skySvg(sb, sb.stars.length, 200)}</div>`,
      title: `${escapeHtml(getProfile().name)} laat ${sb.name.replace(/^(De|Het) /, (w) => w.toLowerCase())} stralen!`,
      actions: [
        { href: `#/${sb.id}`, label: 'Ander niveau' },
        { href: '#/', label: 'Naar de sterrenhemel' },
      ],
    }),
    onAgain: route,
  });
}

setupInfo('Taaltelescoop');
window.addEventListener('hashchange', route);
route();
