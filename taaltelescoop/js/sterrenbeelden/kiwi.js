import { pick } from '../../../shared/js/util.js';
import { gapQuestion, pickFrom } from '../words.js';

// Kilowoorden: je hoort /ie/, maar je schrijft i (ki-lo, pi-loot).
const PIC = [['k[i]lo', '⚖️'], ['k[i]wi', '🥝'], ['p[i]ano', '🎹'], ['p[i]loot', '👨‍✈️'], ['l[i]ter', '🥛'],
  ['v[i]deo', '📼'], ['rad[i]o', '📻'], ['b[i]kini', '👙'], ['m[i]nuut', '⏱️'], ['v[i]tamine', '💊'], ['fam[i]lie', '👨‍👩‍👧'],
  ['Afr[i]ka', '🌍']];
const WORDS = ['t[i]tel', '[i]dee', 'r[i]sico', 'm[i]litair', 'v[i]site', 'p[i]raat', 'g[i]taar', 'l[i]niaal',
  'v[i]ool', 'c[i]troen', 'kr[i]tiek', 'f[i]guur'];

export default {
  intro: 'Een <b>kilowoord</b>: je hoort /ie/ aan het eind van een klankgroep, maar je schrijft <b>i</b>. Ki-lo, pi-a-no, pi-loot.',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Kilo, kiwi en piano', groups: [5] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Idee, titel en gitaar', groups: [5] },
  ],
  makeQuestion(level) {
    const entry = level === 'plaatjes' ? pick(PIC) : [pickFrom(WORDS, PIC.map(([w]) => w))];
    return gapQuestion(entry, ['i', 'ie'], 'i of ie?');
  },
};
