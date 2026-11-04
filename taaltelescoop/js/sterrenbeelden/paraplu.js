import { pick, shuffle } from '../../../shared/js/util.js';

// Komma-s: 's morgens (eerst de komma, dan de s), en het meervoud met een
// lange klank aan het eind: oma's, paraplu's. Behalve bij ee: zeeën.
const TIJD = ["'s morgens", "'s middags", "'s avonds", "'s nachts", "'s zomers", "'s winters", "'s ochtends",
  "'s maandags", "'s zondags"];

// [één, meervoud, foute vormen]
const MEERVOUD = [['oma', "oma's", 'omas'], ['opa', "opa's", 'opas'], ['auto', "auto's", 'autos'], ['foto', "foto's", 'fotos'],
  ['baby', "baby's", 'babys'], ['paraplu', "paraplu's", 'paraplus'], ['pizza', "pizza's", 'pizzas'],
  ['kano', "kano's", 'kanos'], ['radio', "radio's", 'radios'], ['menu', "menu's", 'menus'], ['kiwi', "kiwi's", 'kiwis'],
  ['piano', "piano's", 'pianos'], ['zee', 'zeeën', "zee's"], ['idee', 'ideeën', "idee's"], ['fee', 'feeën', "fee's"]];

export default {
  intro: 'Bij <b>\'s morgens</b> komt eerst de komma, dan de s. Eindigt een woord op een lange klank, zoals <b>oma</b>? Dan schrijf je het meervoud met \'s: <b>oma\'s</b>. Behalve bij ee: <b>zeeën</b>.',
  levels: [
    { id: 'tijd', name: "'s morgens", hint: "Eerst de komma, dan de s", groups: [5] },
    { id: 'meervoud', name: "Oma's en auto's", hint: 'Meervoud met een komma-s', groups: [5] },
  ],
  makeQuestion(level) {
    if (level === 'tijd') {
      const answer = pick(TIJD);
      const word = answer.slice(3);
      return {
        key: answer,
        prompt: 'Hoe schrijf je het?',
        answer,
        choices: shuffle([answer, `s'${word}`, `s${word}`]),
        choiceStyle: 'list',
        revealText: `Zo schrijf je het: ${answer}.`,
        html: '',
      };
    }
    const [one, many, wrong] = pick(MEERVOUD);
    return {
      key: one,
      prompt: `Eén ${one}, twee…`,
      answer: many,
      choices: shuffle([many, wrong]),
      revealText: `Eén ${one}, twee ${many}.`,
      html: `<div class="word-card"><span class="word">${one}</span></div>`,
    };
  },
};
