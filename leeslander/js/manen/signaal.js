import { pick, shuffle } from '../../../shared/js/util.js';

// Signaalwoorden laten zien hoe zinnen bij elkaar horen: een reden (want,
// omdat), iets tegenovergestelds (maar), een volgorde (eerst, daarna) of een
// gevolg (dus). Bij elke zin past maar één van de keuzes goed.
// [zin met ___, goed, fout, fout]
const ZINNEN = [
  ['Ik neem een paraplu mee, ___ het regent.', 'want', 'maar', 'daarna'],
  ['Het regent, ___ neem ik een paraplu mee.', 'dus', 'want', 'eerst'],
  ['Tom wilde buiten spelen, ___ het was te koud.', 'maar', 'want', 'dus'],
  ['___ poets ik mijn tanden, daarna ga ik slapen.', 'Eerst', 'Maar', 'Want'],
  ['Ik eet een boterham. ___ drink ik een glas melk.', 'Daarna', 'Want', 'Maar'],
  ['Lisa is moe, ___ ze heel laat naar bed ging.', 'omdat', 'maar', 'dus'],
  ['De winkel was dicht, ___ gingen we weer naar huis.', 'dus', 'want', 'eerst'],
  ['Sam is klein, ___ hij kan heel hard rennen.', 'maar', 'want', 'dus'],
  ['Ik heb het koud, ___ ik ben mijn jas vergeten.', 'want', 'maar', 'daarna'],
  ['De hond blaft, ___ er staat iemand bij de deur.', 'want', 'maar', 'eerst'],
  ['Eerst doe je je sokken aan, ___ je schoenen.', 'daarna', 'want', 'maar'],
  ['Ik had geen geld meer, ___ kon ik geen ijsje kopen.', 'dus', 'want', 'eerst'],
  ['Het was laat, ___ we waren nog niet moe.', 'maar', 'want', 'dus'],
  ['We gaan naar het strand, ___ de zon schijnt.', 'omdat', 'maar', 'dus'],
  ['De bal ligt op het dak. ___ kunnen we niet verder spelen.', 'Daardoor', 'Maar', 'Eerst'],
  ['Opa leest een boek. ___ valt hij in slaap.', 'Daarna', 'Want', 'Maar'],
];

export default {
  intro: '<b>Signaalwoorden</b> vertellen hoe zinnen bij elkaar horen. <b>Want</b> en <b>omdat</b> geven een reden. <b>Maar</b> zegt dat het anders loopt. <b>Dus</b> zegt wat er gebeurt. <b>Eerst</b> en <b>daarna</b> geven de volgorde.',
  levels: [
    { id: 'kies', name: 'Welk woord past?', hint: 'Want, maar, dus of daarna?', groups: [5] },
  ],
  makeQuestion() {
    const [zin, answer, ...wrong] = pick(ZINNEN);
    return {
      key: zin,
      prompt: 'Welk signaalwoord past?',
      answer,
      choices: shuffle([answer, ...wrong]),
      revealText: zin.replace('___', answer),
      html: `<p class="read-card">${zin.replace('___', '<span class="gap-word">…</span>')}</p>`,
    };
  },
};
