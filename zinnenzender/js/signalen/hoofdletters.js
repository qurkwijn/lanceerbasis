import { pick, shuffle } from '../../../shared/js/util.js';

// Welke zin is goed geschreven? Een zin begint met een hoofdletter en eindigt
// met een punt (of een vraagteken). Namen van mensen en plaatsen krijgen ook
// een hoofdletter.
const ZINNEN = ['De kat slaapt op de bank.', 'Ik eet een appel.', 'Het regent buiten.', 'Wij gaan naar school.',
  'De hond blaft hard.', 'Mijn fiets is rood.', 'Papa bakt pannenkoeken.', 'Het is koud vandaag.',
  'De vogel zit in de boom.', 'Ik heb een nieuwe jas.', 'Waar is mijn tas?', 'Ga je mee spelen?',
  'Oma drinkt thee.', 'De zon schijnt fel.', 'Wij hebben een konijn.', 'Hoe laat is het?'];

const NAMEN = ['Ik speel met Noor.', 'Sem woont in Utrecht.', 'Wij gaan naar Amsterdam.', 'Mijn hond heet Max.',
  'Lisa en Daan zijn vrienden.', 'Opa woont in Groningen.', 'Juf Anna leest een boek voor.',
  'In de zomer gaan we naar Frankrijk.', 'Mijn kat heet Pluis.', 'Tim fietst naar Zwolle.',
  'Morgen komt tante Sara.', 'De trein rijdt naar Rotterdam.'];

const lower = (s) => s[0].toLowerCase() + s.slice(1);
const noEnd = (s) => s.replace(/[.?]$/, '');

// Een fout: geen hoofdletter, geen punt, of een hoofdletter waar hij niet hoort.
function mistakes(sentence, names) {
  const words = sentence.split(' ');
  const wrong = [lower(sentence), noEnd(sentence)];
  if (names) {
    // De namen klein schrijven: "Sem woont in utrecht."
    wrong.push(words.map((w, i) => (i > 0 && /^[A-Z]/.test(w) ? w.toLowerCase() : w)).join(' '));
  } else {
    const i = 1 + Math.floor(Math.random() * (words.length - 1));
    wrong.push(words.map((w, n) => (n === i ? w[0].toUpperCase() + w.slice(1) : w)).join(' '));
  }
  return [...new Set(wrong)].filter((w) => w !== sentence);
}

export default {
  intro: 'Een zin begint met een <b>Hoofdletter</b> en eindigt met een <b>punt</b>. Een vraag eindigt met een <b>?</b>. Namen van mensen, dieren en plaatsen krijgen ook een hoofdletter: <b>Sem</b> woont in <b>Utrecht</b>.',
  levels: [
    { id: 'zin', name: 'Hoofdletter en punt', hint: 'De kat slaapt.', groups: [3, 4] },
    { id: 'namen', name: 'Namen', hint: 'Sem woont in Utrecht.', groups: [4] },
  ],
  makeQuestion(level) {
    const names = level === 'namen';
    const sentence = pick(names ? NAMEN : ZINNEN);
    const wrong = shuffle(mistakes(sentence, names)).slice(0, 2);
    return {
      key: sentence,
      prompt: 'Welke zin is goed geschreven?',
      answer: sentence,
      choices: shuffle([sentence, ...wrong]),
      choiceStyle: 'list',
      revealText: names ? 'Let op de hoofdletters bij de namen!' : 'Een hoofdletter vooraan en een punt aan het eind.',
      html: '',
    };
  },
};
