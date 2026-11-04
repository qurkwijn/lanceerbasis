import { gapQuestion, pickFrom } from '../words.js';

const D_PIC = [['hon[d]', '🐕'], ['be[d]', '🛏️'], ['hoe[d]', '👒'], ['paar[d]', '🐴'], ['broo[d]', '🍞'],
  ['han[d]', '✋'], ['kin[d]', '🧒'], ['bor[d]', '🍽️'], ['zan[d]', '🏖️']];
const T_PIC = [['ka[t]', '🐱'], ['ra[t]', '🐀'], ['voe[t]', '🦶'], ['boo[t]', '🚤'], ['har[t]', '❤️'],
  ['nes[t]', '🪺'], ['pe[t]', '🧢'], ['plan[t]', '🪴']];
const D = ['sta[d]', 'lie[d]', 'tij[d]', 'vrien[d]', 'avon[d]', 'werel[d]', 'lan[d]', 'ein[d]', 'woor[d]', 'mon[d]', 'gel[d]', 'roo[d]', 'goe[d]'];
const T = ['wi[t]', 'kor[t]', 'groo[t]', 'nach[t]', 'lich[t]', 'luch[t]', 'klan[t]', 'spor[t]', 'zou[t]', 'laa[t]', 'nie[t]', 'hee[t]'];

const CHOICES = ['d', 't'];
const PROMPT = 'd of t? Maak het woord langer!';

export default {
  intro: 'Aan het eind hoor je altijd een <b>t</b>, maar soms schrijf je een <b>d</b>. Maak het woord langer: <b>honden</b>, dus <b>hond</b>. <b>Katten</b>, dus <b>kat</b>.',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Hond, kat, bed en voet', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Tijd, wit, stad en nacht', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return gapQuestion(pickFrom(D_PIC, T_PIC), CHOICES, PROMPT);
    return gapQuestion([pickFrom(D, T)], CHOICES, PROMPT);
  },
};
