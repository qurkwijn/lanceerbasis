import { INFO_FOOTER } from './info.js';
import { escapeHtml, pick, speak, stopSpeaking } from './util.js';

// Het spelscherm dat alle voertuigen delen. Een app geeft vragen en de
// plaatjes eromheen; het oefenen, de hulp bij fouten en de sterren gaan
// overal hetzelfde.

export const ROUND = 10;
const PRAISE = ['Goed zo!', 'Super!', 'Knap gedaan!', 'Top!', 'Raketsnel!', 'Precies goed!'];

export function starsHtml(count, max = 3) {
  return Array.from({ length: max }, (_, i) =>
    `<span class="star${i < count ? ' filled' : ''}">★</span>`).join('');
}

// Standaard voortgang: een raketje dat van de aarde naar `goalHtml` vliegt.
const rocketTrack = (goalHtml) => ({
  html: `
    <div class="track">
      <span class="track-end" aria-hidden="true">🌍</span>
      <span class="track-line"><span class="track-fill"></span><span class="track-rocket" aria-hidden="true">🚀</span></span>
      ${goalHtml}
    </div>`,
  update(el, done) {
    el.querySelector('.track').style.setProperty('--progress', done);
  },
});

// Een oefenronde. Normaal 10 vragen; met `level.timed` is het een race tegen
// de klok en tellen we hoeveel je er in die tijd goed hebt.
//
// options:
//   level         { id, timed?, starsAt? }
//   makeQuestion  () => { key, prompt, html, answer, choices?, maxDigits?, onSolved?, solvedDelay? }
//   quitHref      waar het kruisje naartoe gaat
//   goalHtml      plaatje aan het eind van het raketspoor, of
//   progress      { html, update(el, done) } voor een eigen voortgang
//   onStars       (stars) => void, om de sterren te bewaren
//   result        (stars) => { art, title, actions: [{ href, label }] }
//   onAgain       () => void, voor "Nog een keer"
// Geeft een functie terug die de ronde netjes stopt.
export function playRound(root, options) {
  const { level, makeQuestion, quitHref, onStars, result, onAgain } = options;
  const progress = options.progress || rocketTrack(options.goalHtml || '');
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

  root.innerHTML = `
    <div class="screen game-screen">
      <header class="bar">
        <a class="icon-btn" href="${quitHref}" aria-label="Stoppen">✕</a>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${timed || ROUND}">${progress.html}</div>
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

  const promptEl = root.querySelector('.prompt');
  const questionEl = root.querySelector('.question');
  const feedbackEl = root.querySelector('.feedback');
  const progressEl = root.querySelector('.progress');
  const keypadEl = root.querySelector('.keypad');
  const choicesEl = root.querySelector('.choices');
  const timeEl = root.querySelector('.time-left');

  function updateProgress() {
    const done = timed ? Math.min(1, (Date.now() - startedAt) / 1000 / timed) : index / ROUND;
    progress.update(progressEl, done);
    progressEl.setAttribute('aria-valuenow', timed ? Math.round(done * timed) : index);
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
      question = makeQuestion();
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
    updateProgress();
  }

  // Na een goed (of voorgezegd) antwoord mag de vraag nog iets laten zien,
  // zoals de klok die doordraait of het woord dat compleet wordt.
  function advance(delay) {
    busy = true;
    index++;
    updateProgress();
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
    onStars(stars);
    const { art, title, actions } = result(stars);
    root.innerHTML = `
      <div class="screen result">
        ${art}
        <h1>${title}</h1>
        <div class="result-stars" aria-label="${stars} van de 3 sterren">${starsHtml(stars)}</div>
        <p class="result-text">${summary}</p>
        <div class="result-actions">
          <button type="button" class="btn primary" data-again>Nog een keer</button>
          ${actions.map((a) => `<a class="btn" href="${a.href}">${a.label}</a>`).join('')}
        </div>
        ${INFO_FOOTER}
      </div>`;
    root.querySelector('[data-again]').addEventListener('click', onAgain);
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
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    stopSpeaking();
  }
  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  startedAt = Date.now();
  if (timed) {
    clock = setInterval(() => {
      const left = Math.max(0, Math.ceil(timed - (Date.now() - startedAt) / 1000));
      timeEl.textContent = left;
      timeEl.classList.toggle('hurry', left <= 10);
      updateProgress();
      if (left === 0) finish();
    }, 250);
  }
  next();
  return stop;
}
