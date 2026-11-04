import { rand } from '../util.js';

export default {
  intro: 'Een getal kun je in twee stukjes splitsen. Samen zijn ze weer het hele getal.',
  levels: [
    { id: '5', name: 'Tot 5', hint: 'Splits de getallen tot en met 5', groups: [3] },
    { id: '10', name: 'Tot 10', hint: 'Splits de getallen tot en met 10', groups: [3, 4] },
    { id: '20', name: 'Tot 20', hint: 'Splits de getallen van 11 tot en met 20', groups: [4] },
  ],

  makeQuestion(level) {
    const total = { 5: rand(2, 5), 10: rand(3, 10), 20: rand(11, 20) }[level];
    // Tot 20 vaak via het tiental (14 = 10 + 4), zoals op school.
    let left = level === '20' && Math.random() < 0.4 ? 10 : rand(1, total - 1);
    if (Math.random() < 0.5) left = total - left;
    const values = { top: total, left, right: total - left };

    const roll = Math.random();
    const hide = roll < 0.2 ? 'top' : roll < 0.6 ? 'left' : 'right';
    const cell = (pos, cls) => (hide === pos
      ? `<div class="${cls} slot"></div>`
      : `<div class="${cls}">${values[pos]}</div>`);

    return {
      key: `${total}-${left}-${hide}`,
      prompt: hide === 'top' ? 'Hoeveel is het samen?' : 'Welk getal hoort erbij?',
      answer: values[hide],
      html: `
        <div class="split">
          ${cell('top', 'split-top')}
          <svg class="split-legs" viewBox="0 0 240 48" aria-hidden="true">
            <line x1="120" y1="0" x2="60" y2="48" />
            <line x1="120" y1="0" x2="180" y2="48" />
          </svg>
          <div class="split-bottom">
            ${cell('left', 'split-box')}
            ${cell('right', 'split-box')}
          </div>
        </div>`,
    };
  },
};
