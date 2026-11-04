import { pick, rand, slot } from '../util.js';

// Staafjes van 10 en losse blokjes, zoals het MAB-materiaal op school.
function blocks(n) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const bar = `<span class="ten-bar">${'<i></i>'.repeat(10)}</span>`;
  const loose = `<span class="ones">${'<i></i>'.repeat(ones)}</span>`;
  return `<div class="blocks" aria-hidden="true">${bar.repeat(tens)}${ones ? loose : ''}</div>`;
}

const LEVELS = {
  tellen() {
    const n = rand(11, 99);
    return {
      key: `t-${n}`,
      prompt: 'Welk getal is dit? Een staaf is 10.',
      answer: n,
      html: `${blocks(n)}<div class="euro-answer">${slot()}</div>`,
    };
  },
  opbouw() {
    const n = rand(11, 99);
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const askTens = Math.random() < 0.5;
    return {
      key: `o-${n}-${askTens}`,
      prompt: askTens ? 'Hoeveel tientallen?' : 'Hoeveel eenheden?',
      answer: askTens ? tens : ones,
      html: `
        <div class="build">
          <span class="build-number">${n}</span>
          <span class="build-row">${askTens ? slot() : `<b>${tens}</b>`} tientallen</span>
          <span class="build-row">${askTens ? `<b>${ones}</b>` : slot()} eenheden</span>
        </div>`,
    };
  },
  buren() {
    const kind = pick(['na', 'voor']);
    const n = kind === 'na' ? rand(10, 98) : rand(11, 99);
    // Vaak rond een tiental, daar zit de moeilijkheid: na 59 komt 60.
    const m = Math.random() < 0.5 ? (kind === 'na' ? 10 * rand(1, 9) - 1 : 10 * rand(1, 9)) : n;
    return {
      key: `b-${kind}-${m}`,
      prompt: `Welk getal komt ${kind === 'na' ? 'na' : 'vóór'} ${m}?`,
      answer: kind === 'na' ? m + 1 : m - 1,
      maxDigits: 3,
      html: `<div class="sequence">${kind === 'na' ? `<span>${m}</span>${slot()}` : `${slot()}<span>${m}</span>`}</div>`,
    };
  },
};

export default {
  intro: 'Een getal tot 100 bestaat uit <b>tientallen</b> en <b>eenheden</b>. 47 is 4 staven van 10 en 7 losse blokjes.',
  levels: [
    { id: 'tellen', name: 'Staven en blokjes', hint: 'Welk getal is dit?', groups: [4] },
    { id: 'opbouw', name: 'Tientallen en eenheden', hint: '47 = 4 tientallen en 7 eenheden', groups: [4] },
    { id: 'buren', name: 'Ervoor en erna', hint: 'Welk getal komt na 59?', groups: [3, 4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
