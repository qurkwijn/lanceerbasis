import { gapQuestion, pickFrom } from '../words.js';

const AU_PIC = [['[au]to', '🚗'], ['p[au]w', '🦚'], ['bl[au]w', '🔵'], ['k[au]wgom', '🍬'], ['[au]gurk', '🥒']];
const OU_PIC = [['g[ou]d', '🥇'], ['z[ou]t', '🧂'], ['t[ou]w', '🪢'], ['vr[ou]w', '👩'], ['h[ou]t', '🪵'],
  ['k[ou]d', '🥶'], ['k[ou]s', '🧦'], ['kab[ou]ter', '🧙']];
const AU = ['g[au]w', 'fl[au]w', 'l[au]w', 'r[au]w', 's[au]s', 'kl[au]w', 'p[au]ze', 'k[au]wen', 'n[au]w', 'd[au]w'];
const OU = ['[ou]d', 'f[ou]t', 'j[ou]', 'n[ou]', 'b[ou]wen', 'v[ou]wen', 'sch[ou]der', 'm[ou]w', 'tr[ou]wen', 'h[ou]den'];

const CHOICES = ['au', 'ou'];

export default {
  intro: '<b>au</b> en <b>ou</b> klinken hetzelfde. Een ezelsbruggetje: de <b>pauw</b> en de <b>auto</b> zijn blauw, het <b>goud</b> en het <b>hout</b> zijn oud.',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Auto, pauw, goud en touw', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Gauw, oud, saus en fout', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return gapQuestion(pickFrom(AU_PIC, OU_PIC), CHOICES);
    return gapQuestion([pickFrom(AU, OU)], CHOICES);
  },
};
