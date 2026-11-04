import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion, pickFrom } from '../words.js';

// Voorvoegsels be-, ge- en ver-: je hoort "bu", "gu" en "vur".
// Achtervoegsels -ig en -lijk: je hoort "ug" en "luk".
const VOOR = [['[be]talen', '💶'], ['[be]dankt', '🙏'], ['[be]zoek', '🚪'], ['[be]loven', '🤞'], ['[be]slissen', '🤔'],
  ['[ge]zin', '👨‍👩‍👧'], ['[ge]bak', '🍰'], ['[ge]luk', '🍀'], ['[ge]heim', '🤫'], ['[ge]vaar', '⚠️'], ['[ge]bouw', '🏢'],
  ['[ver]haal', '📖'], ['[ver]keer', '🚦'], ['[ver]jaardag', '🎂'], ['[ver]liezen', '😢'], ['[ver]geten', '🤷'],
  ['[ver]huizen', '📦'], ['[ver]stoppen', '🙈']];
const ACHTER = [['zonn[ig]', '☀️'], ['gezell[ig]', '🥳'], ['hand[ig]', '🛠️'], ['nod[ig]', '❗'], ['last[ig]', '😣'],
  ['gelukk[ig]', '😊'], ['honger[ig]', '🍽️'], ['twint[ig]', '2️⃣0️⃣'], ['bez[ig]', '🏃'],
  ['vro[lijk]', '😄'], ['moei[lijk]', '😓'], ['eer[lijk]', '🤝'], ['heer[lijk]', '😋'], ['gevaar[lijk]', '⚠️'],
  ['vriende[lijk]', '😊'], ['duide[lijk]', '💡'], ['makke[lijk]', '👌']];

const WRONG = { be: 'bu', ge: 'gu', ver: 'vur', ig: 'ug', lijk: 'luk' };

function question(entry) {
  const part = entry[0].match(/\[(\w+)\]/)[1];
  return gapQuestion(entry, shuffle([part, WRONG[part]]), 'Hoe schrijf je het?');
}

export default {
  intro: 'Aan het begin hoor je vaak <b>bu</b>, <b>gu</b> of <b>vur</b>, maar je schrijft <b>be</b>, <b>ge</b> en <b>ver</b>. Aan het eind hoor je <b>ug</b> of <b>luk</b>, maar je schrijft <b>-ig</b> en <b>-lijk</b>.',
  levels: [
    { id: 'voor', name: 'be-, ge- en ver-', hint: 'Betalen, geluk en verhaal', groups: [4] },
    { id: 'achter', name: '-ig en -lijk', hint: 'Zonnig en vrolijk', groups: [4] },
    { id: 'mix', name: 'Door elkaar', hint: 'Voor en achter', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'voor') return question(pick(VOOR));
    if (level === 'achter') return question(pick(ACHTER));
    return question(pickFrom(VOOR, ACHTER));
  },
};
