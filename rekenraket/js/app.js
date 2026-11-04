import { INFO_FOOTER, setupInfo } from '../../shared/js/info.js';
import { HOME, getProfile, startUrl } from '../../shared/js/profile.js';
import * as rewards from '../../shared/js/rewards.js';
import { escapeHtml, pick, speak, stopSpeaking } from '../../shared/js/util.js';
import { PLANETS } from './planets.js';

const APP = 'rekenraket';
const app = document.getElementById('app');
const ROUND = 10;
const PRAISE = ['Goed zo!', 'Super!', 'Knap gedaan!', 'Top!', 'Raketsnel!', 'Precies goed!'];

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
  return from > getProfile().groep ? { state: 'locked', from } : { state: 'hidden' };
}

function planetBall(planet, size) {
  const [c1, c2] = planet.colors;
  return `<span class="planet${planet.ring ? ' ringed' : ''}" style="--c1:${c1};--c2:${c2};--size:${size}px"></span>`;
}

function starsHtml(count, max = 3) {
  return Array.from({ length: max }, (_, i) =>
    `<span class="star${i < count ? ' filled' : ''}">★</span>`).join('');
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

// Een oefenronde. Normaal 10 vragen; met `level.timed` is het een race tegen
// de klok en tellen we hoeveel je er in die tijd goed hebt.
function showGame(planet, level) {
  const mod = planet.module;
  const timed = level.timed || 0;
  const seen = new Set();
  let index = 0;
  let good = 0;
  let tries = 0;
  let input = '';
  let busy = false;
  let question;
  let slot;
  let timer;
  let clock;
  let startedAt;

  app.innerHTML = `
    <div class="screen game-screen">
      <header class="bar">
        <a class="icon-btn" href="#/${planet.id}" aria-label="Stoppen">✕</a>
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="${timed || ROUND}">
          <span class="track-end" aria-hidden="true">🌍</span>
          <span class="track-line"><span class="track-fill"></span><span class="track-rocket" aria-hidden="true">🚀</span></span>
          ${planetBall(planet, 28)}
        </div>
        ${timed ? `<span class="time-left" aria-live="off">${timed}</span>` : ''}
      </header>
      <main class="game">
        <p class="prompt"></p>
        <div class="question"></div>
        <p class="feedback" aria-live="polite"></p>
      </main>
      <div class="keypad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-key="${n}">${n}</button>`).join('')}
        <button type="button" data-key="back" class="key-alt" aria-label="Wissen">⌫</button>
        <button type="button" data-key="0">0</button>
        <button type="button" data-key="ok" class="key-ok">OK</button>
      </div>
      <div class="choices" hidden></div>
    </div>`;

  const promptEl = app.querySelector('.prompt');
  const questionEl = app.querySelector('.question');
  const feedbackEl = app.querySelector('.feedback');
  const trackEl = app.querySelector('.track');
  const keypadEl = app.querySelector('.keypad');
  const choicesEl = app.querySelector('.choices');
  const timeEl = app.querySelector('.time-left');

  function updateTrack() {
    const done = timed ? Math.min(1, (Date.now() - startedAt) / 1000 / timed) : index / ROUND;
    trackEl.style.setProperty('--progress', done);
    trackEl.setAttribute('aria-valuenow', timed ? Math.round(done * timed) : index);
  }

  function updateSlot() {
    if (!slot) return;
    slot.textContent = input || '?';
    slot.classList.toggle('empty', !input);
  }

  function setFeedback(text, kind = '') {
    feedbackEl.textContent = text;
    feedbackEl.className = `feedback ${kind}`;
  }

  function next() {
    if (!timed && index === ROUND) return finish();
    for (let attempt = 0; attempt < 30; attempt++) {
      question = mod.makeQuestion(level.id, getProfile());
      if (!seen.has(question.key)) break;
    }
    seen.add(question.key);
    input = '';
    tries = 0;
    busy = false;
    stopSpeaking();
    promptEl.textContent = question.prompt;
    questionEl.innerHTML = question.html;
    slot = questionEl.querySelector('.slot');
    // Een vraag heeft óf een vakje om in te typen, óf keuzeknoppen.
    keypadEl.hidden = Boolean(question.choices);
    choicesEl.hidden = !question.choices;
    choicesEl.innerHTML = (question.choices || []).map((c) =>
      // Korte keuzes zoals "<" of "🔴" krijgen een grotere letter.
      `<button type="button" class="choice${[...c].length <= 2 ? ' choice-big' : ''}" data-choice="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
    setFeedback('');
    updateSlot();
    updateTrack();
  }

  // Na een goed (of voorgezegd) antwoord mag de vraag nog iets laten zien,
  // zoals de klok die doordraait.
  function advance(delay) {
    busy = true;
    index++;
    updateTrack();
    if (question.onSolved) {
      question.onSolved(questionEl);
      if (!timed) delay = Math.max(delay, question.solvedDelay || 0);
    }
    timer = setTimeout(next, delay);
  }

  const correctDelay = timed ? 450 : 900;
  const revealDelay = timed ? 1200 : 2200;

  function choose(btn) {
    if (busy || btn.disabled) return;
    if (btn.dataset.choice === String(question.answer)) {
      if (tries === 0) good++;
      btn.classList.add('correct');
      setFeedback(pick(PRAISE), 'good');
      advance(correctDelay);
      return;
    }
    tries++;
    btn.disabled = true;
    btn.classList.add('wrong');
    if (tries < 2) {
      setFeedback('Bijna! Probeer het nog eens.', 'try');
      return;
    }
    [...choicesEl.children].find((b) => b.dataset.choice === String(question.answer)).classList.add('reveal');
    setFeedback(`Het goede antwoord is ${question.answer}.`, 'reveal');
    advance(revealDelay);
  }

  function check() {
    if (!input) return;
    if (Number(input) === question.answer) {
      if (tries === 0) good++;
      slot.classList.add('correct');
      setFeedback(pick(PRAISE), 'good');
      advance(correctDelay);
      return;
    }
    tries++;
    if (tries < 2) {
      input = '';
      slot.classList.remove('shake');
      void slot.offsetWidth; // herstart de schud-animatie
      slot.classList.add('shake');
      setFeedback('Bijna! Probeer het nog eens.', 'try');
      return;
    }
    input = String(question.answer);
    slot.classList.add('reveal');
    setFeedback(`Het goede antwoord is ${question.answer}.`, 'reveal');
    advance(revealDelay);
  }

  function press(key) {
    if (busy || !slot) return;
    if (/^\d$/.test(key)) {
      if (input.length < (question.maxDigits || 2)) input = input === '0' ? key : input + key;
    } else if (key === 'back') {
      input = input.slice(0, -1);
    } else if (key === 'ok') {
      check();
    }
    updateSlot();
  }

  function finish() {
    stop();
    let stars = good >= 9 ? 3 : good >= 6 ? 2 : 1;
    let summary = `${good} van de ${ROUND} in één keer goed.`;
    if (timed) {
      const [two, three] = level.starsAt;
      stars = good >= three ? 3 : good >= two ? 2 : 1;
      const time = timed === 60 ? '1 minuut' : `${timed} seconden`;
      summary = stars === 3
        ? `${good} goed in ${time}. Supersnel!`
        : `${good} goed in ${time}. Haal er ${stars === 1 ? two : three} voor een extra ster!`;
    }
    saveStars(levelKey(planet, level), stars);
    app.innerHTML = `
      <div class="screen result">
        <div class="result-planet">${planetBall(planet, 140)}<span class="result-rocket" aria-hidden="true">🚀</span></div>
        <h1>${escapeHtml(getProfile().name)} is geland op planeet ${planet.name}!</h1>
        <div class="result-stars" aria-label="${stars} van de 3 sterren">${starsHtml(stars)}</div>
        <p class="result-text">${summary}</p>
        <div class="result-actions">
          <button type="button" class="btn primary" data-again>Nog een keer</button>
          <a class="btn" href="#/${planet.id}">Ander niveau</a>
          <a class="btn" href="#/">Naar de kaart</a>
        </div>
        ${INFO_FOOTER}
      </div>`;
    app.querySelector('[data-again]').addEventListener('click', route);
  }

  const onClick = (e) => {
    const key = e.target.closest('[data-key]');
    if (key) press(key.dataset.key);
    const choice = e.target.closest('[data-choice]');
    if (choice) choose(choice);
    const speakBtn = e.target.closest('[data-speak]');
    if (speakBtn) speak(speakBtn.dataset.speak);
  };
  const onKey = (e) => {
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('back');
    else if (e.key === 'Enter') press('ok');
  };
  function stop() {
    clearTimeout(timer);
    clearInterval(clock);
    app.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    stopSpeaking();
  }
  app.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  cleanup = stop;

  startedAt = Date.now();
  if (timed) {
    clock = setInterval(() => {
      const left = Math.max(0, Math.ceil(timed - (Date.now() - startedAt) / 1000));
      timeEl.textContent = left;
      timeEl.classList.toggle('hurry', left <= 10);
      updateTrack();
      if (left === 0) finish();
    }, 250);
  }
  next();
}

setupInfo('Rekenraket');
window.addEventListener('hashchange', route);
route();
