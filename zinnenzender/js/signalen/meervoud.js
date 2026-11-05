import { pick, shuffle } from '../../../shared/js/util.js';

// Eén kat, twee katten. Meestal komt er -en achter, soms -s. Bij -en verandert
// het woord soms: een korte klank krijgt een dubbele letter (katten), een
// lange klank verliest een letter (bomen).
// [één, meer, foute vormen…]
const EN = [['kat', 'katten', 'katen', 'kats'], ['boom', 'bomen', 'boomen', 'bommen'], ['bal', 'ballen', 'balen', 'bals'],
  ['huis', 'huizen', 'huisen', 'huizzen'], ['vis', 'vissen', 'visen', 'vises'], ['boek', 'boeken', 'boekken', 'boeks'],
  ['schaap', 'schapen', 'schaapen', 'schappen'], ['pen', 'pennen', 'penen', 'pens'], ['raam', 'ramen', 'raamen', 'rammen'],
  ['bed', 'bedden', 'beden', 'beds'], ['muur', 'muren', 'muuren', 'murren'], ['hond', 'honden', 'hondden', 'honds'],
  ['brief', 'brieven', 'briefen', 'briefs'], ['kip', 'kippen', 'kipen', 'kips'], ['boot', 'boten', 'booten', 'botten'],
  ['neus', 'neuzen', 'neusen', 'neussen']];
const S = [['tafel', 'tafels', 'tafelen', 'tafells'], ['appel', 'appels', 'apels', 'appells'],
  ['jongen', 'jongens', 'jongenen', 'jonges'], ['lepel', 'lepels', 'lepelen', 'lepells'], ['vogel', 'vogels', 'vogelen', 'voogels'],
  ['bezem', 'bezems', 'bezemen', 'bezemmen'], ['meisje', 'meisjes', 'meisjen', 'meisjens'], ['oma', "oma's", 'omas', 'omaen'],
  ['auto', "auto's", 'autos', 'autoen'], ['kikker', 'kikkers', 'kikkeren', 'kikers'], ['sleutel', 'sleutels', 'sleutelen', 'sleuteles'],
  ['tractor', 'tractors', 'traktors', 'tracktors']];

export default {
  intro: 'Is er meer dan één? Dan zet je er meestal <b>-en</b> achter: één boek, twee <b>boeken</b>. Woorden op -el, -em, -en en -er krijgen een <b>-s</b>: <b>tafels</b>. Let op: kat wordt <b>katten</b> en boom wordt <b>bomen</b>!',
  levels: [
    { id: 'en', name: 'Met -en', hint: 'Boeken, katten en bomen', groups: [4] },
    { id: 'mix', name: '-en of -s', hint: 'Ook tafels en appels', groups: [4] },
  ],
  makeQuestion(level) {
    const [one, many, ...wrong] = pick(level === 'en' ? EN : pick([EN, S]));
    return {
      key: one,
      prompt: `Eén ${one}, twee…`,
      answer: many,
      choices: shuffle([many, ...wrong]),
      revealText: `Eén ${one}, twee ${many}.`,
      html: `<p class="signal-word">één ${one}</p><p class="signal-word dim">twee …</p>`,
    };
  },
};
