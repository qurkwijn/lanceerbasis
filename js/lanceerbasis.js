import { INFO_FOOTER, setupInfo } from '../shared/js/info.js';
import { GROUPS, getProfile, saveProfile } from '../shared/js/profile.js';
import { totalStars } from '../shared/js/rewards.js';
import { escapeHtml } from '../shared/js/util.js';

const app = document.getElementById('app');

// De apps van de Lanceerbasis. Zonder `ready` staan ze nog op "Binnenkort".
const APPS = [
  { id: 'rekenraket', name: 'Rekenraket', subject: 'Rekenen', icon: '🚀', colors: ['#ffd3a8', '#f08a4b'], ready: true },
  { id: 'taaltelescoop', name: 'Taaltelescoop', subject: 'Taal en spelling', icon: '🔭', colors: ['#c0d4ff', '#4a63c8'], ring: true },
  { id: 'leeslander', name: 'Leeslander', subject: 'Lezen', icon: '📖', colors: ['#b8f5a0', '#4caf50'] },
];

// Routes: #/start (naam en groep), #/start/<app> (daarna terug naar die app)
// en #/ (de apps). Zonder profiel begin je altijd bij de start.
function route() {
  const [page, back] = location.hash.replace(/^#\/?/, '').split('/');
  if (page === 'start' || !getProfile()) return showStart(APPS.find((a) => a.id === back && a.ready));
  showHome();
}

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
          ${GROUPS.map((g) => `<button type="button" class="group-btn" data-groep="${g}" aria-pressed="${g === groep}">Groep ${g}</button>`).join('')}
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
    const btn = e.target.closest('[data-groep]');
    if (!btn) return;
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

function planetBall(item, size) {
  const [c1, c2] = item.colors;
  return `<span class="planet${item.ring ? ' ringed' : ''}" style="--c1:${c1};--c2:${c2};--size:${size}px"></span>`;
}

function showHome() {
  const { name, groep } = getProfile();
  app.innerHTML = `
    <div class="screen">
      <header class="map-header">
        <h1 class="logo">Lanceerbasis</h1>
        <div class="star-count" aria-label="${totalStars()} sterren verdiend">★ ${totalStars()}</div>
      </header>
      <a class="player-chip" href="#/start" aria-label="Naam of groep wijzigen">
        <span>Hoi ${escapeHtml(name)}!</span>
        <span class="groep-badge">Groep ${groep}</span>
        <span class="chip-edit" aria-hidden="true">✎</span>
      </a>
      <p class="map-intro">Waar vlieg je vandaag naartoe?</p>
      <ul class="app-list">
        ${APPS.map((a) => {
          const inner = `
            <span class="app-planet">
              ${planetBall(a, 84)}
              <span class="app-icon" aria-hidden="true">${a.icon}</span>
            </span>
            <span class="app-label">
              <span class="app-name">${a.name}</span>
              <span class="app-sub">${a.subject}</span>
              <span class="app-sub">${a.ready
                ? `<span class="star filled">★</span> ${totalStars(a.id)}`
                : 'Binnenkort'}</span>
            </span>`;
          return `<li>${a.ready
            ? `<a class="app-card" href="${a.id}/">${inner}</a>`
            : `<div class="app-card soon" aria-disabled="true">${inner}</div>`}</li>`;
        }).join('')}
      </ul>
      ${INFO_FOOTER}
    </div>`;
}

setupInfo('de Lanceerbasis');
window.addEventListener('hashchange', route);
route();
