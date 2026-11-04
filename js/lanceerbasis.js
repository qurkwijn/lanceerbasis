import { INFO_FOOTER, setupInfo } from '../shared/js/info.js';
import { ALL_GROUPS, GROUPS, getProfile, saveProfile } from '../shared/js/profile.js';
import { totalStars } from '../shared/js/rewards.js';
import { escapeHtml } from '../shared/js/util.js';
import { STATIONS } from './stations.js';

const app = document.getElementById('app');
const LAUNCH_TIME = 1100;

// Routes: #/start (naam en groep), #/start/<app> (daarna terug naar die app),
// #/logboek (sterren per voertuig) en #/ (de basis). Zonder profiel begin je
// altijd bij de start.
function route() {
  const [page, back] = location.hash.replace(/^#\/?/, '').split('/');
  if (page === 'start' || !getProfile()) return showStart(STATIONS.find((s) => s.id === back && s.ready));
  if (page === 'logboek') return showLog();
  showBase();
}

const stationsFor = (groep) => STATIONS.filter((s) => s.groups.includes(groep));

function showStart(backTo) {
  const profile = getProfile() || { name: '', groep: null };
  let groep = profile.groep;
  app.innerHTML = `
    <div class="screen start">
      <img class="start-icon" src="icons/icon-192.png" alt="" width="112" height="112">
      <h1 class="logo">Lanceerbasis</h1>
      <form class="profile-form" novalidate>
        <label class="form-label" for="player-name">Hoe heet je?</label>
        <input id="player-name" class="name-input" maxlength="20" autocomplete="off"
          autocapitalize="words" spellcheck="false" value="${escapeHtml(profile.name)}" placeholder="Je naam">
        <p class="form-label" id="groep-label">In welke groep zit je?</p>
        <div class="group-choice" role="group" aria-labelledby="groep-label">
          ${ALL_GROUPS.map((g) => GROUPS.includes(g)
            ? `<button type="button" class="group-btn" data-groep="${g}" aria-pressed="${g === groep}">Groep ${g}</button>`
            : `<button type="button" class="group-btn building" data-later="${g}" aria-disabled="true">Groep ${g}<span class="group-soon">In aanbouw</span></button>`).join('')}
        </div>
        <p class="form-error" aria-live="polite"></p>
        <button type="submit" class="btn primary launch-btn">Opstijgen! 🚀</button>
      </form>
      ${INFO_FOOTER}
    </div>`;

  const form = app.querySelector('.profile-form');
  const nameInput = form.querySelector('.name-input');
  const errorEl = form.querySelector('.form-error');

  form.querySelector('.group-choice').addEventListener('click', (e) => {
    const later = e.target.closest('[data-later]');
    if (later) {
      errorEl.textContent = `Groep ${later.dataset.later} is nog in aanbouw 🚧`;
      return;
    }
    const btn = e.target.closest('[data-groep]');
    if (!btn) return;
    errorEl.textContent = '';
    groep = Number(btn.dataset.groep);
    form.querySelectorAll('[data-groep]').forEach((b) => b.setAttribute('aria-pressed', b === btn));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      errorEl.textContent = 'Vul eerst je naam in.';
      return nameInput.focus();
    }
    if (!groep) {
      errorEl.textContent = 'Kies nog in welke groep je zit.';
      return;
    }
    saveProfile({ name, groep });
    if (backTo) location.href = `${backTo.id}/`;
    else if (location.hash === '#/') route();
    else location.hash = '#/';
  });
}

function showBase() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen base">
      <header class="base-header">
        <a class="player-chip" href="#/start" aria-label="Naam of groep wijzigen">
          <span class="groep-badge">Groep ${groep}</span>
          <span class="chip-edit" aria-hidden="true">✎</span>
        </a>
        <a class="log-btn" href="#/logboek" aria-label="Missielogboek, ${totalStars()} sterren">
          <span aria-hidden="true">📋</span> <span class="star filled">★</span> ${totalStars()}
        </a>
      </header>
      <h1 class="base-title">Klaar voor de start,<br><span class="base-name">${escapeHtml(name)}</span>?</h1>
      <p class="base-intro">Kies een voertuig en vertrek!</p>
      <div class="base-sky" aria-hidden="true">
        <span class="planet ringed" style="--c1:#d2b0ff;--c2:#7a4fd6;--size:52px"></span>
        <span class="moon"></span>
      </div>
      <div class="base-ground">
        <ul class="stations">
          ${stationsFor(groep).map((s) => {
            const inner = `
              ${s.art()}
              <span class="station-sign">
                <span class="station-name">${s.name}</span>
                <span class="station-sub">${s.ready ? s.subject : 'In aanbouw 🚧'}</span>
              </span>`;
            return `<li>${s.ready
              ? `<a class="station" href="${s.id}/" data-launch>${inner}</a>`
              : `<div class="station building" aria-disabled="true">${inner}</div>`}</li>`;
          }).join('')}
        </ul>
        ${INFO_FOOTER}
      </div>
    </div>`;
  // Begin met het voertuig dat al klaar staat in het midden.
  app.querySelector('a.station')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

// Een korte lancering voordat je naar de wereld van het voertuig gaat. Nog een
// keer tikken slaat hem over.
function launch(e) {
  const station = e.target.closest('[data-launch]');
  if (!station) return;
  if (station.classList.contains('launching') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  e.preventDefault();
  station.classList.add('launching');
  setTimeout(() => { location.href = station.href; }, LAUNCH_TIME);
}

function showLog() {
  const { groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Terug naar de basis">←</a>
        <h1>Missielogboek</h1>
        <span class="groep-badge">Groep ${groep}</span>
      </header>
      <p class="log-total"><span class="star filled">★</span> ${totalStars()} sterren verdiend</p>
      <ul class="log-list">
        ${stationsFor(groep).map((s) => `
          <li class="log-item${s.ready ? '' : ' building'}">
            <span class="log-art">${s.art()}</span>
            <span class="log-label">
              <span class="log-name">${s.name}</span>
              <span class="log-sub">${s.ready ? `Op weg naar ${s.world}` : 'In aanbouw 🚧'}</span>
            </span>
            ${s.ready ? `<span class="log-stars"><span class="star filled">★</span> ${totalStars(s.id)}</span>` : ''}
          </li>`).join('')}
      </ul>
      ${INFO_FOOTER}
    </div>`;
}

setupInfo('de Lanceerbasis');
app.addEventListener('click', launch);
window.addEventListener('hashchange', route);
// Terug met de browserknop na een lancering: zet de basis weer klaar.
window.addEventListener('pageshow', (e) => { if (e.persisted) route(); });
route();
