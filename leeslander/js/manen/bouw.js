import { pick, shuffle } from '../../../shared/js/util.js';

// Tik de woorden in de goede volgorde. Het eerste woord heeft een hoofdletter
// en achter het laatste staat een punt: dat helpt je op weg.
const KORT = ['De kat slaapt.', 'Ik eet een appel.', 'Papa drinkt koffie.', 'De zon schijnt.', 'Wij spelen buiten.',
  'Het regent hard.', 'De hond blaft.', 'Oma bakt een taart.', 'De vogel zingt.', 'Ik fiets naar school.',
  'De baby huilt.', 'Tim heeft een bal.', 'De vis zwemt.', 'Wij eten soep.', 'Het is koud.', 'De bus is rood.',
  'Ik zie een ster.', 'De koe eet gras.', 'Lisa springt hoog.', 'Jij bent mijn vriend.'];

const LANG = ['De kat zit op de bank.', 'Wij gaan naar het strand.', 'Opa leest elke dag de krant.',
  'Na school speel ik buiten.', 'Mijn zus heeft een rode fiets.', 'In de zomer is het warm.',
  'De hond rent door het park.', 'Morgen gaan wij naar de dierentuin.', 'De juf schrijft op het bord.',
  'Het konijn eet een wortel.', 'De kinderen spelen in de zandbak.', 'Ik drink een glas melk.',
  'Een vlinder vliegt naar de bloem.', 'De trein rijdt heel snel.', 'We bouwen een hut in het bos.',
  'Mama leest een boek voor.', 'Mijn opa heeft een grote tuin.', 'De kikker springt in de sloot.'];

const LIST = { kort: KORT, lang: LANG };

function scramble(words) {
  // Nooit al in de goede volgorde.
  for (let i = 0; i < 10; i++) {
    const tiles = shuffle(words);
    if (tiles.join(' ') !== words.join(' ')) return tiles;
  }
  return [...words].reverse();
}

export default {
  intro: 'De woorden zijn door elkaar gehusseld! Tik ze in de goede volgorde, zodat er een goede zin staat.',
  levels: [
    { id: 'kort', name: 'Korte zinnen', hint: 'Drie of vier woorden', groups: [4] },
    { id: 'lang', name: 'Lange zinnen', hint: 'Vijf of zes woorden', groups: [4] },
  ],
  makeQuestion(level) {
    const sentence = pick(LIST[level]);
    return {
      key: sentence,
      prompt: 'Maak de zin!',
      answer: sentence,
      tiles: scramble(sentence.split(' ')),
      html: '',
    };
  },
};
