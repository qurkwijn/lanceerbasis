import { pick, rand, slot } from '../util.js';

// Een getallenlijn van `from` tot `to` met een streepje per `step`.
// Alleen de getallen in `labels` staan erbij; de pijl wijst naar `target`.
function numberLine({ from, to, step, labels, target }) {
  const x = (n) => 20 + ((n - from) / (to - from)) * 300;
  const ticks = [];
  for (let n = from; n <= to; n += step) {
    const big = labels.includes(n) || (n - from) % (step * 5) === 0;
    ticks.push(`<line class="nl-tick${big ? ' big' : ''}" x1="${x(n)}" x2="${x(n)}" y1="${big ? 52 : 57}" y2="${big ? 78 : 73}" />`);
  }
  return `
    <svg class="numberline" viewBox="0 0 340 110" role="img" aria-label="Getallenlijn van ${from} tot ${to}">
      <line class="nl-line" x1="12" x2="328" y1="65" y2="65" />
      ${ticks.join('')}
      ${labels.map((n) => `<text x="${x(n)}" y="98">${n}</text>`).join('')}
      <path class="nl-arrow" d="M${x(target)} 50 l-9 -16 h18 z" />
      <line class="nl-arrow-stem" x1="${x(target)}" x2="${x(target)}" y1="8" y2="36" />
    </svg>`;
}

function question(config) {
  return {
    key: `${config.from}-${config.to}-${config.target}`,
    prompt: 'Welk getal hoort bij de pijl?',
    answer: config.target,
    maxDigits: 3,
    html: `${numberLine(config)}<div class="line-answer"><span>De pijl wijst naar</span>${slot()}</div>`,
  };
}

// Kies een doel dat niet al bij een getal op de lijn staat.
function target(candidates, labels) {
  return pick(candidates.filter((n) => !labels.includes(n)));
}

const range = (from, to, step = 1) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const LEVELS = {
  tot10() {
    const labels = [0, 5, 10];
    return question({ from: 0, to: 10, step: 1, labels, target: target(range(1, 9), labels) });
  },
  tot20() {
    const labels = [0, 10, 20];
    return question({ from: 0, to: 20, step: 1, labels, target: target(range(1, 19), labels) });
  },
  tientallen() {
    const labels = [0, 50, 100];
    return question({ from: 0, to: 100, step: 10, labels, target: target(range(10, 90, 10), labels) });
  },
  // Ingezoomd tussen twee tientallen, bijvoorbeeld van 40 tot 50.
  tot100() {
    const from = 10 * rand(1, 9);
    const labels = [from, from + 10];
    return question({ from, to: from + 10, step: 1, labels, target: target(range(from + 1, from + 9), labels) });
  },
};

export default {
  intro: 'Op een getallenlijn staan de getallen op een rij, van klein naar groot. Tel de streepjes vanaf een getal dat je weet. De lange streepjes helpen je, zoals bij 5, 10 en 15.',
  levels: [
    { id: 'tot10', name: 'Tot 10', hint: 'Met de 0, 5 en 10 erbij', groups: [3] },
    { id: 'tot20', name: 'Tot 20', hint: 'Met de 0, 10 en 20 erbij', groups: [3, 4] },
    { id: 'tientallen', name: 'Tientallen tot 100', hint: 'Sprongen van 10', groups: [4] },
    { id: 'tot100', name: 'Tot 100', hint: 'Ingezoomd tussen twee tientallen', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
