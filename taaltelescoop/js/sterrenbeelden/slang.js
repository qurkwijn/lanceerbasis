import { gapQuestion, pickFrom } from '../words.js';

const NG_PIC = [['ri[ng]', '💍'], ['sla[ng]', '🐍'], ['koni[ng]', '👑'], ['to[ng]', '👅'], ['jo[ng]en', '👦'],
  ['ba[ng]', '😨'], ['za[ng]er', '🎤'], ['vi[ng]er', '☝️']];
const NK_PIC = [['ba[nk]', '🛋️'], ['dri[nk]en', '🥤'], ['de[nk]en', '🤔'], ['i[nk]t', '🖋️'], ['sti[nk]en', '🦨'],
  ['pla[nk]', '🪵'], ['bli[nk]en', '✨']];
const NG = ['la[ng]', 'di[ng]', 'zi[ng]en', 'ga[ng]', 'wa[ng]', 'kri[ng]', 'ha[ng]en', 'va[ng]en', 'spri[ng]en', 'e[ng]'];
const NK = ['da[nk]', 'pi[nk]', 'li[nk]s', 'kli[nk]er', 'vo[nk]', 'sla[nk]', 'sta[nk]', 'wi[nk]el', 'e[nk]el', 'zi[nk]en'];

const CHOICES = ['ng', 'nk'];

export default {
  intro: 'Bij <b>ng</b> hoor je geen k, zoals in <b>slang</b>. Bij <b>nk</b> hoor je aan het eind een k, zoals in <b>bank</b>. Zeg het woord maar zachtjes!',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Ring, slang, bank en inkt', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Lang, dank, ding en pink', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return gapQuestion(pickFrom(NG_PIC, NK_PIC), CHOICES);
    return gapQuestion([pickFrom(NG, NK)], CHOICES);
  },
};
