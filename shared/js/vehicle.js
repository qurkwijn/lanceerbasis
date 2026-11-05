import { playRound, starsHtml } from './game.js';
import { INFO_FOOTER, setupInfo } from './info.js';
import { HOME, getProfile, startUrl } from './profile.js';
import * as rewards from './rewards.js';
import { escapeHtml } from './util.js';

// Wat alle voertuigen delen: de kaart met onderdelen, het scherm om een niveau
// te kiezen en het oefenen. Een voertuig geeft alleen zijn eigen onderdelen,
// plaatjes en teksten mee.
//
// Routes: #/ (de kaart), #/<onderdeel> (niveau kiezen), #/<onderdeel>/<niveau>
// (oefenen). Naam en groep kies je op de Lanceerbasis; zonder profiel ga je
// daarheen en kom je daarna hier terug.
//
// options:
//   id, name        het voertuig, zoals 'rekenraket' en 'Rekenraket'
//   items           de onderdelen, elk met id, name, (sub,) module
//   cls             voorvoegsel van de CSS-klassen, zoals 'planet' of 'sky'
//   mapIntro        de zin boven de kaart
//   art(item, phase, size)  het plaatje van een onderdeel; phase gaat van 0 tot 1
//   mapSize         maat op de kaart, of (index) => maat voor wisselende maten
//   heroSize        maat op het scherm om een niveau te kiezen
//   heroSub         de ondertitel onder het grote plaatje tonen
//   mapName         'de kaart', 'Mars'…: voor "Terug naar …"
//   progress(item)  { html, update(el, done) } voor de voortgang, of
//   goal(item)      het doel aan het eind van het standaard raketspoor
//   resultArt(item), resultTitle(item, name)   het eindscherm
export function startVehicle(options) {
  const { id: APP, items, cls } = options;
  const app = document.getElementById('app');
  let cleanup = null;

  const levelKey = (item, level) => `${item.id}-${level.id}`;
  const levelsFor = (item) => item.module.levels.filter((l) => l.groups.includes(getProfile().groep));
  // Je ziet alleen wat bij jouw groep hoort, zodat de lijst kort blijft.
  const isOpen = (item) => levelsFor(item).length > 0;
  const getStars = (item, level) => rewards.getStars(APP, levelKey(item, level));
  const itemStars = (item) => levelsFor(item).reduce((sum, l) => sum + getStars(item, l), 0);
  const maxStars = (item) => levelsFor(item).length * 3;
  // Elke verdiende ster maakt het plaatje een stukje voller.
  const phaseFor = (item) => (maxStars(item) ? itemStars(item) / maxStars(item) : 0);
  const mapSize = (i) => (typeof options.mapSize === 'function' ? options.mapSize(i) : options.mapSize || 96);

  function route() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    if (!getProfile()) return location.replace(startUrl(APP));
    const [itemId, levelId] = location.hash.replace(/^#\/?/, '').split('/');
    const item = items.find((i) => i.id === itemId);
    if (!item || !isOpen(item)) return showMap();
    const level = levelsFor(item).find((l) => l.id === levelId);
    if (!level) return showItem(item);
    showGame(item, level);
  }

  function showMap() {
    const { name, groep } = getProfile();
    const open = items.filter(isOpen);
    // In de kop alleen de sterren van wat je nu ziet.
    const total = open.reduce((sum, item) => sum + itemStars(item), 0);
    app.innerHTML = `
      <div class="screen">
        <header class="map-header">
          <a class="icon-btn" href="${HOME}" aria-label="Terug naar de Lanceerbasis">←</a>
          <h1 class="logo" tabindex="-1">${options.name}</h1>
          <div class="star-count"><span aria-hidden="true">★ ${total}</span><span class="sr-only">${total} sterren verdiend</span></div>
        </header>
        <a class="player-chip" href="${startUrl(APP)}">
          <span>Hoi ${escapeHtml(name)}!</span>
          <span class="groep-badge">Groep ${groep}</span>
          <span class="chip-edit" aria-hidden="true">✎</span><span class="sr-only">wijzigen</span>
        </a>
        <p class="map-intro">${options.mapIntro}</p>
        <ol class="${cls}-path">
          ${open.map((item, i) => `
            <li><a class="${cls}-link" href="#/${item.id}">
              ${options.art(item, phaseFor(item), mapSize(i))}
              <span class="${cls}-label">
                <span class="${cls}-name">${item.name}</span>
                ${item.sub ? `<span class="${cls}-sub">${item.sub}</span>` : ''}
                <span class="${cls}-sub"><span class="star filled" aria-hidden="true">★</span> ${itemStars(item)} / ${maxStars(item)}<span class="sr-only"> sterren</span></span>
              </span>
            </a></li>`).join('')}
        </ol>
        ${INFO_FOOTER}
      </div>`;
    app.querySelector('h1').focus({ preventScroll: true });
  }

  function showItem(item) {
    app.innerHTML = `
      <div class="screen">
        <header class="bar">
          <a class="icon-btn" href="#/" aria-label="Terug naar ${options.mapName}">←</a>
          <h1 tabindex="-1">${item.name}</h1>
          <span class="groep-badge">Groep ${getProfile().groep}</span>
        </header>
        <div class="${cls}-hero">${options.art(item, phaseFor(item), options.heroSize || 150)}</div>
        ${options.heroSub && item.sub ? `<p class="${cls}-hero-sub">${item.sub}</p>` : ''}
        <p class="intro">${item.module.intro}</p>
        <div class="levels">
          ${levelsFor(item).map((l) => `
            <a class="level-card" href="#/${item.id}/${l.id}">
              <span class="level-name">${l.name}</span>
              <span class="level-hint">${l.hint}</span>
              <span class="level-stars">${starsHtml(getStars(item, l))}</span>
            </a>`).join('')}
        </div>
        ${INFO_FOOTER}
      </div>`;
    app.querySelector('h1').focus({ preventScroll: true });
  }

  function showGame(item, level) {
    cleanup = playRound(app, {
      level,
      makeQuestion: () => item.module.makeQuestion(level.id, getProfile()),
      quitHref: `#/${item.id}`,
      progress: options.progress?.(item),
      goalHtml: options.goal?.(item),
      onStars: (stars) => rewards.saveStars(APP, levelKey(item, level), stars),
      result: () => ({
        art: options.resultArt(item),
        title: options.resultTitle(item, escapeHtml(getProfile().name)),
        actions: [
          { href: `#/${item.id}`, label: 'Ander niveau' },
          { href: '#/', label: `Naar ${options.mapName}` },
        ],
      }),
      onAgain: route,
    });
  }

  setupInfo(options.name);
  window.addEventListener('hashchange', route);
  route();
}

// Voortgang waarbij een voertuigje over een spoor naar het doel rijdt.
export const trackProgress = (vehicleHtml, goalHtml, cls) => ({
  html: `
    <div class="track ${cls}-track">
      <span class="track-line"><span class="track-fill"></span><span class="track-${cls}">${vehicleHtml}</span></span>
      <span class="track-goal" aria-hidden="true">${goalHtml}</span>
    </div>`,
  update(el, done) {
    el.querySelector('.track').style.setProperty('--progress', done);
  },
});
