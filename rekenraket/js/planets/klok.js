import { pick, rand, shuffle } from '../util.js';

// Tijden rekenen we als minuten sinds 12 uur (0 t/m 719), want de klok heeft 12 uren.
const toMinutes = (h, m) => (h % 12) * 60 + m;
const nextHour = (h) => (h % 12) + 1;

function fromMinutes(total) {
  const t = ((total % 720) + 720) % 720;
  return { h: Math.floor(t / 60) || 12, m: t % 60 };
}

// Zoals op school: "3 uur", "half 4", "kwart over 3", "kwart voor 4".
function timeText({ h, m }) {
  if (m === 0) return `${h} uur`;
  if (m === 15) return `kwart over ${h}`;
  if (m === 30) return `half ${nextHour(h)}`;
  return `kwart voor ${nextHour(h)}`;
}

function clockSvg({ h, m }) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const big = i % 5 === 0;
    return `<line class="tick${big ? ' big' : ''}" x1="100" y1="${big ? 16 : 14}" x2="100" y2="${big ? 26 : 20}" transform="rotate(${i * 6} 100 100)" />`;
  }).join('');
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = (n * 30 * Math.PI) / 180;
    return `<text x="${(100 + 62 * Math.sin(a)).toFixed(1)}" y="${(100 - 62 * Math.cos(a)).toFixed(1)}">${n}</text>`;
  }).join('');
  return `
    <svg class="clock" viewBox="0 0 200 200" role="img" aria-label="Een klok">
      <circle class="clock-rim" cx="100" cy="100" r="98" />
      <circle class="clock-face" cx="100" cy="100" r="92" />
      ${ticks}${numbers}
      <line class="hand hand-hour" x1="100" y1="106" x2="100" y2="56" style="transform: rotate(${(h % 12) * 30 + m / 2}deg)" />
      <line class="hand hand-minute" x1="100" y1="110" x2="100" y2="24" style="transform: rotate(${m * 6}deg)" />
      <circle class="clock-pin" cx="100" cy="100" r="6" />
    </svg>`;
}

const LEGEND = `
  <p class="clock-legend">
    <span><i class="dot hour"></i> korte wijzer: uur</span>
    <span><i class="dot minute"></i> lange wijzer: minuten</span>
  </p>`;

// Drie foute antwoorden die lijken op de fouten die kinderen echt maken.
function makeChoices(answer, mistakes) {
  const wrong = [...new Set(mistakes.map((t) => timeText(fromMinutes(t))))]
    .filter((t) => t !== answer);
  return shuffle([answer, ...shuffle(wrong).slice(0, 3)]);
}

function readQuestion(level) {
  const minutes = {
    uren: [0],
    halve: [0, 30, 30],
    kwartier: [0, 15, 15, 30, 45, 45],
  }[level];
  const time = { h: rand(1, 12), m: pick(minutes) };
  const t = toMinutes(time.h, time.m);
  const answer = timeText(time);
  const mistakes = [t - 60, t + 60, t - 120, t + 120];
  if (time.m === 30) mistakes.push(t - 30, t + 30); // "half 4" verwarren met 3 of 4 uur
  if (time.m === 15 || time.m === 45) mistakes.push(t + 30, t - 30); // kwart over/voor omdraaien

  return {
    key: `${level}-${t}`,
    prompt: 'Hoe laat is het?',
    answer,
    choices: makeChoices(answer, mistakes),
    html: clockSvg(time) + LEGEND,
  };
}

function shiftQuestion() {
  const start = { h: rand(1, 12), m: pick([0, 0, 30]) };
  const shift = pick([60, 60, 120, 120, 180, 30]) * (Math.random() < 0.5 ? 1 : -1);
  const t = toMinutes(start.h, start.m);
  const amount = { 30: 'een half uur', 60: '1 uur', 120: '2 uur', 180: '3 uur' }[Math.abs(shift)];
  const answer = timeText(fromMinutes(t + shift));
  // Typische fouten: de verkeerde kant op, één uur te veel of te weinig, of de tijd van nu.
  const mistakes = [t - shift, t + shift + 60, t + shift - 60, t];

  return {
    key: `later-${t}-${shift}`,
    prompt: `Hoe laat is het ${amount} ${shift > 0 ? 'later' : 'vroeger'}?`,
    answer,
    choices: makeChoices(answer, mistakes),
    html: clockSvg(start) + LEGEND,
    // Laat de wijzers naar de nieuwe tijd draaien, zodat je ziet wat er gebeurt.
    solvedDelay: 2600,
    onSolved(el) {
      el.querySelector('.hand-hour').style.transform = `rotate(${(start.h % 12) * 30 + start.m / 2 + shift / 2}deg)`;
      el.querySelector('.hand-minute').style.transform = `rotate(${start.m * 6 + shift * 6}deg)`;
    },
  };
}

export default {
  intro: `De <b class="hour-text">korte wijzer</b> wijst het uur aan, de <b class="minute-text">lange wijzer</b> de minuten.
    Staat de lange wijzer op de 6? Dan is het <b>half</b>: half 4 is een half uur vóór 4 uur.`,
  levels: [
    { id: 'uren', name: 'Hele uren', hint: 'De lange wijzer staat op de 12', groups: [3, 4] },
    { id: 'halve', name: 'Halve uren', hint: 'Hele uren en half', groups: [3, 4] },
    { id: 'kwartier', name: 'Kwartieren', hint: 'Kwart over en kwart voor', groups: [4] },
    { id: 'later', name: 'Later en vroeger', hint: 'Hoe laat is het 2 uur later?', groups: [4] },
  ],

  makeQuestion(level) {
    return level === 'later' ? shiftQuestion() : readQuestion(level);
  },
};
