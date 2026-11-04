import { pick, rand, slot } from '../util.js';

const THINGS = ['⭐', '🍓', '🐞', '🌸', '🐟', '🍪', '🎈', '🐥'];

// Dingen in rijtjes van 5, zoals op een rekenrek: dan zie je sneller hoeveel.
function objects(count) {
  const thing = pick(THINGS);
  const rows = [];
  for (let left = count; left > 0; left -= 5) {
    rows.push(`<span class="count-row">${thing.repeat(Math.min(5, left))}</span>`);
  }
  return `<div class="count-grid${count > 10 ? ' two-cols' : ''}" aria-hidden="true">${rows.join('')}</div>`;
}

const PIPS = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};

function die(value) {
  const dots = PIPS[value].map((p) =>
    `<circle cx="${14 + (p % 3) * 18}" cy="${14 + Math.floor(p / 3) * 18}" r="6" />`).join('');
  return `<svg class="die" viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="12" />${dots}</svg>`;
}

const answerBox = `<div class="euro-answer">${slot()}</div>`;

const LEVELS = {
  tot10() {
    const n = rand(1, 10);
    return { key: `t10-${n}`, prompt: 'Hoeveel zie je?', answer: n, html: objects(n) + answerBox };
  },
  tot20() {
    const n = rand(11, 20);
    return { key: `t20-${n}`, prompt: 'Hoeveel zie je? Tel in groepjes van 5.', answer: n, html: objects(n) + answerBox };
  },
  // Dobbelsteenbeelden herkennen zonder te tellen.
  dobbelsteen() {
    const a = rand(1, 6);
    const b = Math.random() < 0.3 ? 0 : rand(1, 6);
    return {
      key: `d-${a}-${b}`,
      prompt: b ? 'Hoeveel stippen zijn het samen?' : 'Hoeveel stippen zie je?',
      answer: a + b,
      html: `<div class="dice">${die(a)}${b ? die(b) : ''}</div>${answerBox}`,
    };
  },
};

export default {
  intro: 'Tel goed: tik in gedachten elk ding één keer aan. Bij rijtjes van 5 hoef je niet alles te tellen!',
  levels: [
    { id: 'tot10', name: 'Tellen tot 10', hint: 'Hoeveel zie je?', groups: [3] },
    { id: 'dobbelsteen', name: 'Dobbelstenen', hint: 'Herken de stippen', groups: [3] },
    { id: 'tot20', name: 'Tellen tot 20', hint: 'Met rijtjes van 5', groups: [3] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
