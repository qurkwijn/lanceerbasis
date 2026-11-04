import { pick, rand, slot } from '../util.js';

const TREATS = ['🍬', '🍪', '🍓', '🧁', '🍭', '🍒'];
const KIDS = ['🧒', '👧', '👦', '🧒🏽', '👧🏻', '👦🏾'];

function share(each, kids) {
  const total = each * kids;
  const treat = pick(TREATS);
  const picture = total <= 24
    ? `<div class="share" aria-hidden="true">
         <div class="share-treats">${treat.repeat(total)}</div>
         <div class="share-kids">${Array.from({ length: kids }, (_, i) => KIDS[i % KIDS.length]).join('')}</div>
       </div>`
    : '';
  return {
    key: `${total}-${kids}`,
    prompt: `${total} ${treat} eerlijk verdelen over ${kids} kinderen. Hoeveel krijgt ieder kind?`,
    answer: each,
    html: `${picture}<div class="sum"><span>${total}</span><span class="op">:</span><span>${kids}</span><span class="op">=</span>${slot()}</div>`,
  };
}

// Delen met rest: 17 : 5 = 3, en er blijven 2 over.
function rest() {
  let total;
  let kids;
  do {
    kids = rand(2, 9);
    total = rand(kids + 1, kids * 9);
  } while (total % kids === 0);
  const askRest = Math.random() < 0.5;
  const each = Math.floor(total / kids);
  return {
    key: `r-${total}-${kids}-${askRest}`,
    prompt: askRest
      ? `${total} knikkers verdelen over ${kids} kinderen. Hoeveel blijven er over?`
      : `${total} knikkers verdelen over ${kids} kinderen. Hoeveel krijgt ieder kind?`,
    answer: askRest ? total % kids : each,
    revealText: `${total} : ${kids} = ${each} rest ${total % kids}`,
    html: `<div class="sum"><span>${total}</span><span class="op">:</span><span>${kids}</span><span class="op">=</span>${askRest ? `<span>${each}</span><span class="half-label">rest</span>${slot()}` : `${slot()}<span class="half-label">rest ?</span>`}</div>`,
  };
}

const LEVELS = {
  klein: () => share(rand(1, 5), rand(2, 4)),
  groot: () => share(rand(2, 10), pick([2, 3, 4, 5, 10])),
  rest,
};

export default {
  intro: 'Eerlijk delen betekent dat iedereen <b>evenveel</b> krijgt. Deel ze één voor één uit, net zolang tot alles op is. Kan het niet precies? Dan blijft er een <b>rest</b> over.',
  levels: [
    { id: 'klein', name: 'Eerlijk delen tot 20', hint: 'Met plaatjes erbij', groups: [4] },
    { id: 'groot', name: 'Eerlijk delen tot 50', hint: 'Gebruik de tafels', groups: [4] },
    { id: 'rest', name: 'Delen met rest', hint: '17 : 5 = 3 rest 2', groups: [5] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
