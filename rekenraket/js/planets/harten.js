import { rand } from '../util.js';

// Een tienvak (2 rijen van 5): de gekleurde rondjes zijn het getal dat je ziet,
// de lege rondjes zijn zijn verliefde hart.
function tenFrame(filled) {
  return `<div class="ten-frame" aria-hidden="true">${Array.from({ length: 10 }, (_, i) =>
    `<i class="${i < filled ? 'on' : ''}"></i>`).join('')}</div>`;
}

function pair(n, total, frame) {
  return {
    key: `${total}-${n}`,
    prompt: `Wie is verliefd op ${n}? Samen zijn ze ${total}.`,
    answer: total - n,
    maxDigits: 3,
    html: `
      <div class="hearts">
        <span class="heart">${n}</span>
        <span class="heart-plus">+</span>
        <span class="heart slot"></span>
      </div>
      <p class="hearts-total">samen ${total}</p>
      ${frame ? tenFrame(n) : ''}`,
  };
}

const LEVELS = {
  tienvak: () => pair(rand(1, 9), 10, true),
  tien: () => pair(rand(0, 10), 10, false),
  honderd: () => pair(10 * rand(1, 9), 100, false),
};

export default {
  intro: 'Verliefde harten zijn twee getallen die samen precies <b>10</b> zijn, zoals 3 en 7. Ken je ze uit je hoofd? Dan ga je makkelijk over de 10!',
  levels: [
    { id: 'tienvak', name: 'Met het tienvak', hint: 'Tel de lege rondjes', groups: [3] },
    { id: 'tien', name: 'Verliefde harten', hint: 'Samen 10, uit je hoofd', groups: [3, 4] },
    { id: 'honderd', name: 'Verliefde tientallen', hint: 'Samen 100, zoals 30 en 70', groups: [4] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
