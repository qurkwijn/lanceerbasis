import { gapQuestion, pickFrom } from '../words.js';

const EI_PIC = [['tr[ei]n', '🚆'], ['[ei]', '🥚'], ['g[ei]t', '🐐'], ['z[ei]l', '⛵'], ['[ei]land', '🏝️'],
  ['m[ei]sje', '👧'], ['pl[ei]ster', '🩹'], ['r[ei]s', '🧳']];
const IJ_PIC = [['[ij]s', '🍦'], ['b[ij]', '🐝'], ['t[ij]ger', '🐯'], ['r[ij]st', '🍚'], ['k[ij]ker', '🔭'],
  ['[ij]sbeer', '🐻‍❄️'], ['pr[ij]s', '🏆'], ['kr[ij]t', '🖍️'], ['p[ij]l', '🏹']];
const EI = ['kl[ei]n', 'pl[ei]n', 'v[ei]lig', '[ei]gen', 'w[ei]nig', 'st[ei]l', 'h[ei]de', '[ei]nd', 'br[ei]en', 'z[ei]len'];
const IJ = ['bl[ij]', 'm[ij]n', 'z[ij]n', 't[ij]d', 'l[ij]n', 'd[ij]k', 'f[ij]n', 'p[ij]n', 'k[ij]ken', 'w[ij]', 'b[ij]na', 'schr[ij]ven'];

const CHOICES = ['ei', 'ij'];

export default {
  intro: '<b>ei</b> en <b>ij</b> klinken precies hetzelfde. Je moet dus onthouden hoe je het woord schrijft. Kijk goed naar het plaatje!',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Trein, ijs, geit en bij', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Klein, blij, tijd en plein', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return gapQuestion(pickFrom(EI_PIC, IJ_PIC), CHOICES);
    return gapQuestion([pickFrom(EI, IJ)], CHOICES);
  },
};
