import { escapeHtml, pick } from '../../shared/js/util.js';

// Een woord met een gat erin, zoals "tr[ei]n". Wat tussen de haken staat, moet
// het kind kiezen. Na het antwoord vult het gat zich met de goede letters.
// Met 🔊 hoor je welk woord bedoeld is: "m?n" kan man of maan zijn.
export function gapQuestion(entry, choices, prompt = 'Welke letters missen?') {
  const [word, pic] = entry;
  const [before, answer, after] = word.split(/[[\]]/);
  return {
    key: word,
    prompt,
    answer,
    choices,
    html: `
      <div class="word-card">
        ${pic ? `<span class="word-pic" aria-hidden="true">${pic}</span>` : ''}
        <span class="word">${before}<span class="gap">?</span>${after}</span>
        <button type="button" class="speak-word" data-speak="${escapeHtml(before + answer + after)}" aria-label="Lees het woord voor">🔊</button>
      </div>`,
    onSolved(el) {
      const gap = el.querySelector('.gap');
      gap.textContent = answer;
      gap.classList.add('filled');
    },
  };
}

// Kies eerlijk tussen twee lijsten, zodat "ei" en "ij" ongeveer even vaak
// voorkomen.
export const pickFrom = (...lists) => pick(pick(lists));
