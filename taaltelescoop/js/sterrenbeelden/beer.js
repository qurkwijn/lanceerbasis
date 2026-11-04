import { pick, shuffle } from '../../../shared/js/util.js';
import { gapQuestion, pickFrom } from '../words.js';

// eer, oor, eur en eel: je hoort ie, oe of u, maar je schrijft ee, oo of eu.
const PIC = [['b[ee]r', '🐻'], ['p[ee]r', '🍐'], ['v[ee]r', '🪶'], ['d[eu]r', '🚪'], ['kl[eu]r', '🎨'], ['[oo]r', '👂'],
  ['b[oo]r', '🪛'], ['sp[oo]r', '🛤️'], ['g[ee]l', '🟡'], ['k[ee]l', '🗣️'], ['st[ee]l', '🍒'], ['g[eu]r', '👃']];
const WORDS = ['m[ee]r', 'k[ee]r', 'l[ee]r', 'w[ee]r', 'z[ee]r', 'h[ee]r', 'd[oo]r', 'v[oo]r', 'h[oo]r', 'sch[eu]r',
  'zw[ee]r', 'v[ee]l', 'd[ee]l', 'm[ee]l', 'sp[ee]l', 'k[oo]r', 'sl[eu]r'];

const PAIRS = { ee: ['ee', 'ie'], oo: ['oo', 'oe'], eu: ['eu', 'u'] };

function question(entry) {
  const sound = entry[0].match(/\[(\w+)\]/)[1];
  return gapQuestion(entry, shuffle(PAIRS[sound]), 'Welke klank schrijf je?');
}

export default {
  intro: 'Voor een <b>r</b> of <b>l</b> klinkt het anders. Je hoort <b>bier</b>, maar je schrijft <b>beer</b>. Zo ook: <b>deur</b>, <b>oor</b> en <b>geel</b>. Denk aan: eer, oor, eur, eel!',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Beer, deur, oor en geel', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Meer, voor en veel', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return question(pick(PIC));
    return question([pickFrom(WORDS, PIC.map(([w]) => w))]);
  },
};
