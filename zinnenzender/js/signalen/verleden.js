import { pick, shuffle } from '../../../shared/js/util.js';

// De verleden tijd van sterke werkwoorden: die veranderen van klank in plaats
// van -de of -te te krijgen. Vandaag loop ik, gisteren liep ik.
// [nu, vroeger, foute vorm die kinderen vaak maken]
const STERK = [['loop', 'liep', 'loopte'], ['zwem', 'zwom', 'zwemde'], ['eet', 'at', 'eette'], ['drink', 'dronk', 'drinkte'],
  ['zie', 'zag', 'ziede'], ['schrijf', 'schreef', 'schrijfde'], ['lees', 'las', 'leesde'], ['spring', 'sprong', 'springde'],
  ['geef', 'gaf', 'geefde'], ['kom', 'kwam', 'komde'], ['vind', 'vond', 'vindde'], ['zing', 'zong', 'zingde'],
  ['slaap', 'sliep', 'slaapte'], ['roep', 'riep', 'roepte'], ['val', 'viel', 'valde'], ['help', 'hielp', 'helpte'],
  ['vlieg', 'vloog', 'vliegde'], ['rijd', 'reed', 'rijdde'], ['neem', 'nam', 'neemde'], ['sta', 'stond', 'stade']];

export default {
  intro: 'Wat je al gedaan hebt, zeg je in de <b>verleden tijd</b>. Bij veel werkwoorden verandert de klank: vandaag <b>loop</b> ik, gisteren <b>liep</b> ik. Vandaag <b>zwem</b> ik, gisteren <b>zwom</b> ik.',
  levels: [
    { id: 'sterk', name: 'Gisteren…', hint: 'Loop wordt liep', groups: [5] },
  ],
  makeQuestion() {
    const [nu, toen, fout] = pick(STERK);
    const other = pick(STERK.filter(([n]) => n !== nu))[1];
    return {
      key: nu,
      prompt: 'Hoe zeg je het in de verleden tijd?',
      answer: toen,
      choices: shuffle([toen, fout, other]),
      revealText: `Vandaag ${nu} ik, gisteren ${toen} ik.`,
      html: `<p class="signal-sentence">Vandaag <mark>${nu}</mark> ik.</p><p class="signal-sentence">Gisteren <span class="gap">?</span> ik.</p>`,
    };
  },
};
