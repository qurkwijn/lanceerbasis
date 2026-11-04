import { pick, shuffle } from '../../../shared/js/util.js';

// Woordsoorten: een zelfstandig naamwoord is een ding, dier, mens of plaats
// (je kunt er de of het voor zetten), een werkwoord is wat je doet, en een
// bijvoeglijk naamwoord zegt hoe iets is.
const ZN = 'zelfstandig naamwoord';
const WW = 'werkwoord';
const BN = 'bijvoeglijk naamwoord';

const LOS = [['fiets', ZN], ['hond', ZN], ['school', ZN], ['appel', ZN], ['huis', ZN], ['boom', ZN], ['juf', ZN], ['stoel', ZN],
  ['lopen', WW], ['zwemmen', WW], ['lezen', WW], ['springen', WW], ['klimmen', WW], ['schrijven', WW], ['lachen', WW], ['bouwen', WW],
  ['groot', BN], ['rood', BN], ['zacht', BN], ['snel', BN], ['blij', BN], ['koud', BN], ['mooi', BN], ['oud', BN]];

// [zin, het woord dat je moet benoemen, de woordsoort]
const ZINNEN = [['De hond blaft naar de kat.', 'hond', ZN], ['De hond blaft naar de kat.', 'blaft', WW],
  ['Ik heb een rode fiets.', 'rode', BN], ['Ik heb een rode fiets.', 'fiets', ZN], ['Wij zwemmen in het meer.', 'zwemmen', WW],
  ['Het is een koude dag.', 'koude', BN], ['Oma bakt een lekkere taart.', 'bakt', WW], ['Oma bakt een lekkere taart.', 'lekkere', BN],
  ['Oma bakt een lekkere taart.', 'taart', ZN], ['De kleine muis rent weg.', 'kleine', BN], ['De kleine muis rent weg.', 'rent', WW],
  ['De juf leest een spannend boek.', 'boek', ZN], ['De juf leest een spannend boek.', 'spannend', BN],
  ['Mijn broer speelt voetbal.', 'speelt', WW], ['Het grote paard eet gras.', 'paard', ZN], ['Het grote paard eet gras.', 'grote', BN]];

const CHOICES = [ZN, WW, BN];

export default {
  intro: 'Een <b>zelfstandig naamwoord</b> is een mens, dier, ding of plaats: je kunt er <b>de</b> of <b>het</b> voor zetten. Een <b>werkwoord</b> is wat je doet. Een <b>bijvoeglijk naamwoord</b> zegt hoe iets is: een <b>rode</b> fiets.',
  levels: [
    { id: 'los', name: 'Losse woorden', hint: 'Fiets, lopen of groot?', groups: [5] },
    { id: 'zin', name: 'In een zin', hint: 'Welk soort woord is het?', groups: [5] },
  ],
  makeQuestion(level) {
    if (level === 'los') {
      const [word, answer] = pick(LOS);
      return {
        key: word,
        prompt: 'Wat voor woord is dit?',
        answer,
        choices: shuffle(CHOICES),
        choiceStyle: 'list',
        revealText: `${word} is een ${answer}.`,
        html: `<p class="signal-word">${word}</p>`,
      };
    }
    const [zin, word, answer] = pick(ZINNEN);
    return {
      key: `${zin}-${word}`,
      prompt: 'Wat voor woord is het gekleurde woord?',
      answer,
      choices: shuffle(CHOICES),
      choiceStyle: 'list',
      revealText: `${word} is hier een ${answer}.`,
      html: `<p class="signal-sentence">${zin.replace(new RegExp(`\\b${word}\\b`), `<mark>${word}</mark>`)}</p>`,
    };
  },
};
