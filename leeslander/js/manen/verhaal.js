import { pick, shuffle } from '../../../shared/js/util.js';

// Een kort verhaaltje met een vraag. Bij elke vraag staat het goede antwoord
// eerst; de keuzes worden daarna door elkaar gehusseld.
const KORT = [
  {
    text: 'Sam heeft een nieuwe fiets. De fiets is blauw. Sam fietst naar het park.',
    vragen: [['Welke kleur heeft de fiets?', 'blauw', 'rood', 'groen'],
      ['Waar fietst Sam naartoe?', 'naar het park', 'naar school', 'naar oma']],
  },
  {
    text: 'Het regent buiten. Noor pakt haar gele laarzen. Ze springt in een plas.',
    vragen: [['Wat doet Noor?', 'Ze springt in een plas.', 'Ze gaat slapen.', 'Ze eet een ijsje.'],
      ['Welke kleur hebben de laarzen?', 'geel', 'rood', 'blauw']],
  },
  {
    text: 'Opa bakt een taart. Het is een appeltaart. Iedereen krijgt een stuk.',
    vragen: [['Wat bakt opa?', 'een appeltaart', 'een pizza', 'koekjes'],
      ['Wie bakt de taart?', 'opa', 'oma', 'mama']],
  },
  {
    text: 'De kat ligt in de zon. Ze is heel moe. Ze valt in slaap.',
    vragen: [['Waar ligt de kat?', 'in de zon', 'in de regen', 'in de boom'],
      ['Hoe voelt de kat zich?', 'moe', 'boos', 'bang']],
  },
  {
    text: 'Lot gaat naar de dierentuin. Ze ziet een grote olifant. De olifant drinkt water.',
    vragen: [['Welk dier ziet Lot?', 'een olifant', 'een leeuw', 'een aap'],
      ['Wat doet de olifant?', 'Hij drinkt water.', 'Hij slaapt.', 'Hij eet een banaan.']],
  },
  {
    text: 'Het is winter. Er ligt sneeuw in de tuin. Bram maakt een sneeuwpop.',
    vragen: [['Wat maakt Bram?', 'een sneeuwpop', 'een zandkasteel', 'een tekening'],
      ['Welk seizoen is het?', 'winter', 'zomer', 'lente']],
  },
  {
    text: 'Mila is jarig. Ze wordt zeven jaar. Ze krijgt een puppy.',
    vragen: [['Hoe oud wordt Mila?', 'zeven jaar', 'vijf jaar', 'negen jaar'],
      ['Wat krijgt Mila?', 'een puppy', 'een fiets', 'een boek']],
  },
  {
    text: 'De bus is te laat. Tim wacht bij de halte. Eindelijk komt de bus eraan.',
    vragen: [['Waar wacht Tim?', 'bij de halte', 'bij school', 'thuis'],
      ['Waar wacht Tim op?', 'de bus', 'de trein', 'zijn vriend']],
  },
  {
    text: 'Papa en Ella gaan vissen. Ze zitten bij het water. Ella vangt een grote vis.',
    vragen: [['Wie vangt een vis?', 'Ella', 'papa', 'niemand'],
      ['Wat gaan papa en Ella doen?', 'vissen', 'zwemmen', 'voetballen']],
  },
  {
    text: 'Het is nacht. De uil is wakker. Hij zoekt een muis.',
    vragen: [['Wat zoekt de uil?', 'een muis', 'een vis', 'een worm'],
      ['Wanneer is de uil wakker?', 'in de nacht', 'in de ochtend', 'na school']],
  },
  {
    text: 'Daan heeft honger. Hij pakt een banaan. De banaan is lekker zoet.',
    vragen: [['Waarom pakt Daan een banaan?', 'Hij heeft honger.', 'Hij is moe.', 'Hij heeft het koud.'],
      ['Hoe smaakt de banaan?', 'zoet', 'zuur', 'zout']],
  },
  {
    text: 'Fien speelt met de bal. De bal rolt onder de bank. Haar hond haalt de bal terug.',
    vragen: [['Waar rolt de bal naartoe?', 'onder de bank', 'in de sloot', 'op het dak'],
      ['Wie haalt de bal terug?', 'de hond', 'Fien', 'mama']],
  },
  {
    text: 'De juf leest voor in de klas. Het boek gaat over een draak. Alle kinderen luisteren stil.',
    vragen: [['Waar gaat het boek over?', 'een draak', 'een prinses', 'een paard'],
      ['Wat doen de kinderen?', 'Ze luisteren stil.', 'Ze rennen rond.', 'Ze zingen een lied.']],
  },
  {
    text: 'Het is heel warm. Sem en Yara gaan naar het strand. Ze bouwen een groot zandkasteel.',
    vragen: [['Wat bouwen Sem en Yara?', 'een zandkasteel', 'een hut', 'een sneeuwpop'],
      ['Hoe is het weer?', 'warm', 'koud', 'het regent']],
  },
];

const LANG = [
  {
    text: 'Jesse wil buiten voetballen. Maar het onweert en het regent hard. Mama zegt dat hij binnen moet blijven. Daarom bouwt Jesse een hut van dekens.',
    vragen: [['Waarom moet Jesse binnen blijven?', 'Het onweert.', 'Hij is ziek.', 'Het is al donker.'],
      ['Wat doet Jesse binnen?', 'Hij bouwt een hut.', 'Hij voetbalt.', 'Hij gaat slapen.']],
  },
  {
    text: 'Lieke zoekt haar knuffel. Ze kijkt onder haar bed. Ze kijkt in de kast. Dan ziet ze het: haar broertje heeft de knuffel!',
    vragen: [['Wie had de knuffel?', 'haar broertje', 'de hond', 'papa'],
      ['Waar keek Lieke als eerste?', 'onder haar bed', 'in de kast', 'in de tuin']],
  },
  {
    text: 'Het is herfst. De blaadjes vallen van de bomen. Ruben en opa harken de tuin. Onder de bladeren vinden ze een egel. Die slaapt daar tot de lente.',
    vragen: [['Wat vinden ze onder de bladeren?', 'een egel', 'een muis', 'een kikker'],
      ['Wanneer wordt de egel wakker?', 'in de lente', 'morgen', 'in de herfst']],
  },
  {
    text: 'Zara gaat voor het eerst alleen naar de bakker. Ze moet een bruin brood kopen. Ze vindt het een beetje spannend. Maar de bakker is aardig en geeft haar een koekje.',
    vragen: [['Wat moet Zara kopen?', 'een bruin brood', 'een taart', 'koekjes'],
      ['Hoe voelt Zara zich eerst?', 'Ze vindt het spannend.', 'Ze is boos.', 'Ze is verdrietig.']],
  },
  {
    text: 'De kip van boer Jan legt elke dag een ei. Vandaag ligt er geen ei in het hok. Boer Jan zoekt overal. Het ei ligt in de kruiwagen!',
    vragen: [['Waar ligt het ei vandaag?', 'in de kruiwagen', 'in het hok', 'in de schuur'],
      ['Wie zoekt het ei?', 'boer Jan', 'de kip', 'de hond']],
  },
  {
    text: 'Noah heeft een plantje gekregen. Hij zet het op de vensterbank in de zon. Elke dag geeft hij het een beetje water. Na een week zit er een rode bloem aan.',
    vragen: [['Welke kleur heeft de bloem?', 'rood', 'geel', 'paars'],
      ['Wat doet Noah elke dag?', 'Hij geeft het plantje water.', 'Hij zingt voor het plantje.', 'Hij zet het plantje buiten.']],
  },
  {
    text: 'Emma en haar vader gaan kamperen. Ze zetten de tent op bij een meer. In de avond eten ze soep bij het kampvuur. In de nacht horen ze een uil roepen.',
    vragen: [['Waar staat de tent?', 'bij een meer', 'in de tuin', 'op een berg'],
      ['Wat horen ze in de nacht?', 'een uil', 'een hond', 'onweer']],
  },
  {
    text: 'Milan is zijn tas vergeten. Zijn boterhammen zitten erin. Gelukkig deelt zijn vriendin Sophie haar lunch. Ze eten allebei een boterham met kaas.',
    vragen: [['Wat is Milan vergeten?', 'zijn tas', 'zijn jas', 'zijn fiets'],
      ['Wie deelt haar lunch?', 'Sophie', 'de juf', 'mama']],
  },
  {
    text: 'De vogels in de tuin hebben honger. Het is winter en de grond is bevroren. Isa hangt een vetbol in de boom. Al snel komen er vogeltjes eten.',
    vragen: [['Waarom hebben de vogels honger?', 'De grond is bevroren.', 'Ze zijn ziek.', 'Het is zomer.'],
      ['Wat hangt Isa in de boom?', 'een vetbol', 'een vogelhuisje', 'een lampje']],
  },
  {
    text: 'Kim leert zwemmen. In het begin vindt ze het water eng. De badjuf helpt haar elke week. Nu heeft Kim haar zwemdiploma!',
    vragen: [['Wie helpt Kim?', 'de badjuf', 'haar opa', 'haar zus'],
      ['Wat vond Kim in het begin?', 'Het water was eng.', 'Het water was te warm.', 'Zwemmen was saai.']],
  },
  {
    text: 'Thomas en Lina bouwen een toren van blokken. De toren wordt heel hoog. Dan loopt de kat ertegenaan. Boem! De toren valt om.',
    vragen: [['Waarom valt de toren om?', 'De kat loopt ertegenaan.', 'Thomas duwt ertegen.', 'Het waait hard.'],
      ['Waar bouwen ze de toren van?', 'blokken', 'zand', 'kaarten']],
  },
  {
    text: 'Vandaag is het sportdag. Er is touwtrekken, zaklopen en een estafette. Sven wint het zaklopen. Zijn klas wint de estafette.',
    vragen: [['Wat wint Sven?', 'het zaklopen', 'het touwtrekken', 'niets'],
      ['Wat wint de klas van Sven?', 'de estafette', 'het touwtrekken', 'het zaklopen']],
  },
  {
    text: 'De oma van Anna woont ver weg. Daarom gaat Anna met de trein. De reis duurt twee uur. Oma staat op het station te zwaaien.',
    vragen: [['Waarom gaat Anna met de trein?', 'Oma woont ver weg.', 'De auto is kapot.', 'Het regent.'],
      ['Hoe lang duurt de reis?', 'twee uur', 'tien minuten', 'een hele dag']],
  },
  {
    text: 'Het is bijna Sinterklaas. Luuk zet zijn schoen bij de deur. Hij doet er een wortel in voor het paard. De volgende ochtend zit er chocolade in zijn schoen.',
    vragen: [['Wat doet Luuk in zijn schoen?', 'een wortel', 'een tekening', 'een appel'],
      ['Wat zit er de volgende ochtend in de schoen?', 'chocolade', 'een wortel', 'niets']],
  },
];

const LIST = { kort: KORT, lang: LANG };

export default {
  intro: 'Lees het verhaaltje goed. Daarna komt er een vraag. Je mag het verhaaltje nog een keer lezen!',
  levels: [
    { id: 'kort', name: 'Korte verhaaltjes', hint: 'Drie zinnen en een vraag', groups: [3, 4] },
    { id: 'lang', name: 'Lange verhaaltjes', hint: 'Vier of vijf zinnen, ook met waarom', groups: [4, 5] },
  ],
  makeQuestion(level) {
    const story = pick(LIST[level]);
    const [vraag, answer, ...wrong] = pick(story.vragen);
    return {
      // Per ronde komt elk verhaaltje maar één keer.
      key: story.text,
      prompt: 'Lees het verhaaltje.',
      answer,
      choices: shuffle([answer, ...wrong]),
      choiceStyle: 'list',
      revealText: `Het goede antwoord is: ${answer}`,
      html: `<p class="read-card story">${story.text}</p><p class="read-question">${vraag}</p>`,
    };
  },
};
