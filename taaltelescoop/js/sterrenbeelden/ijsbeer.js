import { gapQuestion, pickFrom } from '../words.js';

// Onthoudwoorden: ei en ij klinken hetzelfde, au en ou ook. Je hoort het niet,
// dus je moet onthouden hoe je het woord schrijft.
const EI_PIC = [['tr[ei]n', '🚆'], ['[ei]', '🥚'], ['g[ei]t', '🐐'], ['z[ei]l', '⛵'], ['[ei]land', '🏝️'],
  ['m[ei]sje', '👧'], ['pl[ei]ster', '🩹'], ['r[ei]s', '🧳']];
const IJ_PIC = [['[ij]s', '🍦'], ['b[ij]', '🐝'], ['t[ij]ger', '🐯'], ['r[ij]st', '🍚'], ['k[ij]ker', '🔭'],
  ['[ij]sbeer', '🐻‍❄️'], ['pr[ij]s', '🏆'], ['kr[ij]t', '🖍️'], ['p[ij]l', '🏹']];
const EI = ['kl[ei]n', 'pl[ei]n', 'v[ei]lig', '[ei]gen', 'w[ei]nig', 'h[ei]de', '[ei]nd', 'br[ei]en', 'z[ei]len'];
const IJ = ['bl[ij]', 'm[ij]n', 'z[ij]n', 't[ij]d', 'l[ij]n', 'd[ij]k', 'f[ij]n', 'p[ij]n', 'k[ij]ken', 'b[ij]na', 'schr[ij]ven'];

const AU_PIC = [['[au]to', '🚗'], ['p[au]w', '🦚'], ['bl[au]w', '🔵'], ['k[au]wgom', '🍬'], ['[au]gurk', '🥒']];
const OU_PIC = [['g[ou]d', '🥇'], ['z[ou]t', '🧂'], ['t[ou]w', '🪢'], ['vr[ou]w', '👩'], ['h[ou]t', '🪵'],
  ['k[ou]d', '🥶'], ['k[ou]s', '🧦']];
const AU = ['g[au]w', 'fl[au]w', 'l[au]w', 's[au]s', 'kl[au]w', 'p[au]ze', 'k[au]wen', 'n[au]w', 'd[au]w'];
const OU = ['[ou]d', 'f[ou]t', 'j[ou]', 'n[ou]', 'b[ou]wen', 'v[ou]wen', 'sch[ou]der', 'm[ou]w', 'tr[ou]wen', 'h[ou]den'];

const LEVELS = {
  plaatjes: () => gapQuestion(pickFrom(EI_PIC, IJ_PIC), ['ei', 'ij']),
  woorden: () => gapQuestion([pickFrom(EI, IJ)], ['ei', 'ij']),
  'au-plaatjes': () => gapQuestion(pickFrom(AU_PIC, OU_PIC), ['au', 'ou']),
  'au-woorden': () => gapQuestion([pickFrom(AU, OU)], ['au', 'ou']),
};

export default {
  intro: '<b>ei</b> en <b>ij</b> klinken precies hetzelfde, en <b>au</b> en <b>ou</b> ook. Je moet dus onthouden hoe je het woord schrijft. Een ezelsbruggetje: de <b>pauw</b> en de <b>auto</b> zijn blauw, het <b>goud</b> en het <b>hout</b> zijn oud.',
  levels: [
    { id: 'plaatjes', name: 'ei of ij, met plaatjes', hint: 'Trein, ijs, geit en bij', groups: [4] },
    { id: 'woorden', name: 'ei of ij, zonder plaatjes', hint: 'Klein, blij, tijd en plein', groups: [4] },
    { id: 'au-plaatjes', name: 'au of ou, met plaatjes', hint: 'Auto, pauw, goud en touw', groups: [4] },
    { id: 'au-woorden', name: 'au of ou, zonder plaatjes', hint: 'Gauw, oud, saus en fout', groups: [4] },
  ],
  makeQuestion(level) {
    return LEVELS[level]();
  },
};
