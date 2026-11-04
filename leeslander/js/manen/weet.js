import { pick, shuffle } from '../../../shared/js/util.js';

// Informatieve teksten: geen verhaaltje, maar weetjes over echte dingen. Bij
// elke vraag staat het goede antwoord eerst; de keuzes worden daarna door
// elkaar gehusseld.
const TEKSTEN = [
  {
    pic: '🦔',
    text: 'Een egel heeft stekels op zijn rug. Als hij bang is, rolt hij zich op tot een bal. In de winter houdt een egel een winterslaap.',
    vragen: [['Wat doet een egel als hij bang is?', 'Hij rolt zich op.', 'Hij rent hard weg.', 'Hij gaat zingen.'],
      ['Wanneer houdt een egel een winterslaap?', 'in de winter', 'in de zomer', 'elke nacht']],
  },
  {
    pic: '🐝',
    text: 'Bijen wonen samen in een korf. Ze vliegen van bloem naar bloem. Van de nectar uit de bloemen maken ze honing.',
    vragen: [['Waar wonen bijen?', 'in een korf', 'in een hol', 'in een nest op de grond'],
      ['Wat maken bijen van nectar?', 'honing', 'melk', 'suiker']],
  },
  {
    pic: '🌙',
    text: 'De maan draait om de aarde. De maan geeft zelf geen licht. Hij wordt beschenen door de zon.',
    vragen: [['Waar draait de maan omheen?', 'om de aarde', 'om de sterren', 'om Mars'],
      ['Geeft de maan zelf licht?', 'Nee, de zon schijnt erop.', 'Ja, de maan is een lamp.', 'Ja, maar alleen op zondag.']],
  },
  {
    pic: '🐸',
    text: 'Een kikker begint als een eitje in het water. Uit het eitje komt een kikkervisje. Het kikkervisje krijgt pootjes en wordt een kikker.',
    vragen: [['Wat komt er uit het eitje?', 'een kikkervisje', 'een vlinder', 'een vis'],
      ['Waar ligt het eitje van een kikker?', 'in het water', 'in een boom', 'in de woestijn']],
  },
  {
    pic: '🍂',
    text: 'In de herfst worden de bladeren geel, oranje en bruin. Dan vallen ze van de bomen. In de lente groeien er nieuwe blaadjes.',
    vragen: [['Wanneer vallen de bladeren van de bomen?', 'in de herfst', 'in de lente', 'in de zomer'],
      ['Wanneer groeien er nieuwe blaadjes?', 'in de lente', 'in de herfst', 'in de winter']],
  },
  {
    pic: '🐧',
    text: 'Pinguïns zijn vogels, maar ze kunnen niet vliegen. Ze kunnen wel heel goed zwemmen. Ze eten vooral vis.',
    vragen: [['Wat kunnen pinguïns niet?', 'vliegen', 'zwemmen', 'lopen'],
      ['Wat eten pinguïns vooral?', 'vis', 'gras', 'appels']],
  },
  {
    pic: '🦷',
    text: 'Kinderen krijgen eerst melktanden. Rond je zesde jaar gaan ze wiebelen en vallen ze uit. Daarna groeien er grote tanden.',
    vragen: [['Hoe heten de eerste tanden?', 'melktanden', 'kaastanden', 'wiebeltanden'],
      ['Wat gebeurt er als een melktand uitvalt?', 'Er groeit een grote tand.', 'Er komt nooit meer een tand.', 'Je krijgt een snor.']],
  },
  {
    pic: '🚒',
    text: 'De brandweer blust branden. In de brandweerauto zit een lange slang voor het water. Het telefoonnummer bij nood is 112.',
    vragen: [['Wat doet de brandweer?', 'branden blussen', 'brood bakken', 'post brengen'],
      ['Welk nummer bel je bij nood?', '112', '123', '999']],
  },
  {
    pic: '🌱',
    text: 'Een plant heeft water, licht en lucht nodig om te groeien. Met de wortels drinkt de plant water uit de grond.',
    vragen: [['Waarmee drinkt een plant water?', 'met de wortels', 'met de bloemen', 'met de blaadjes'],
      ['Wat heeft een plant nodig?', 'water, licht en lucht', 'snoep en limonade', 'alleen donker']],
  },
  {
    pic: '🦒',
    text: 'De giraf is het hoogste dier op aarde. Met zijn lange nek kan hij bij de blaadjes bovenin de boom. Een giraf woont in Afrika.',
    vragen: [['Waarom heeft een giraf een lange nek?', 'om bij hoge blaadjes te kunnen', 'om goed te kunnen zwemmen', 'om te kunnen zingen'],
      ['Waar woont de giraf?', 'in Afrika', 'op de Noordpool', 'in de zee']],
  },
  {
    pic: '☀️',
    text: 'De zon is een ster. Hij is heel groot en heel heet. Kijk nooit recht in de zon, want dat is slecht voor je ogen.',
    vragen: [['Wat is de zon?', 'een ster', 'een planeet', 'een lamp'],
      ['Waarom mag je niet in de zon kijken?', 'Dat is slecht voor je ogen.', 'Dan word je moe.', 'Dan gaat de zon uit.']],
  },
  {
    pic: '🐄',
    text: 'Een koe eet gras. Een koe geeft melk. Van melk kun je kaas, boter en yoghurt maken.',
    vragen: [['Wat eet een koe?', 'gras', 'vis', 'brood'],
      ['Wat kun je van melk maken?', 'kaas', 'sap', 'jam']],
  },
  {
    pic: '🦋',
    text: 'Een vlinder begint als een rups. De rups eet heel veel blaadjes. Dan maakt hij een pop. Uit de pop komt een vlinder.',
    vragen: [['Hoe begint een vlinder?', 'als een rups', 'als een vogel', 'als een bloem'],
      ['Wat komt er uit de pop?', 'een vlinder', 'een rups', 'een bij']],
  },
  {
    pic: '🚲',
    text: 'In Nederland fietsen veel mensen. Er zijn meer fietsen dan mensen! Op de fiets draag je in het donker licht, zodat anderen je zien.',
    vragen: [['Waarom heb je licht op je fiets in het donker?', 'zodat anderen je zien', 'om te lezen', 'omdat het mooi is'],
      ['Zijn er in Nederland veel fietsen?', 'Ja, meer dan mensen.', 'Nee, bijna geen.', 'Nee, alleen auto’s.']],
  },
];

export default {
  intro: 'In een <b>weetjestekst</b> leer je iets over echte dingen, zoals dieren of de ruimte. Lees goed en zoek het antwoord in de tekst!',
  levels: [
    { id: 'kort', name: 'Weetjes', hint: 'Over dieren, planten en de ruimte', groups: [4] },
  ],
  makeQuestion() {
    const tekst = pick(TEKSTEN);
    const [vraag, answer, ...wrong] = pick(tekst.vragen);
    return {
      // Per ronde komt elke tekst maar één keer.
      key: tekst.text,
      prompt: 'Lees de tekst.',
      answer,
      choices: shuffle([answer, ...wrong]),
      choiceStyle: 'list',
      revealText: `Het goede antwoord is: ${answer}`,
      html: `<p class="read-card story"><span aria-hidden="true">${tekst.pic}</span> ${tekst.text}</p><p class="read-question">${vraag}</p>`,
    };
  },
};
