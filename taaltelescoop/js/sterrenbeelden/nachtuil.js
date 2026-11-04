import { pick } from '../../../shared/js/util.js';
import { gapQuestion, pickFrom } from '../words.js';

// Luchtwoorden: na een korte klank schrijf je cht. Alleen ligt, legt en zegt
// schrijf je met een g, want die komen van liggen, leggen en zeggen.
const PIC = [['na[cht]', '🌃'], ['li[cht]', '💡'], ['lu[cht]', '☁️'], ['a[cht]', '8️⃣'], ['vlu[cht]', '✈️'],
  ['do[cht]er', '👧'], ['bo[cht]', '↩️'], ['gra[cht]', '🛶'], ['ve[cht]en', '🤺'], ['kra[cht]', '💪']];
const WORDS = ['e[cht]', 'za[cht]', 're[cht]', 'sle[cht]', 'zu[cht]', 'to[cht]', 'vra[cht]', 'wa[cht]en',
  'la[cht]en', 'pli[cht]', 'ri[cht]ing', 'ni[cht]', 'ma[cht]'];
const UITZONDERING = ['hij li[gt]', 'zij le[gt]', 'hij ze[gt]'];

const CHOICES = ['ch', 'cht', 'gt'];
const PROMPT = 'ch, cht of gt?';

export default {
  intro: 'Na een korte klank schrijf je <b>cht</b>, zoals in <b>lucht</b> en <b>nacht</b>. Er zijn maar drie uitzonderingen: <b>hij ligt</b>, <b>hij legt</b> en <b>hij zegt</b>.',
  levels: [
    { id: 'plaatjes', name: 'Met plaatjes', hint: 'Nacht, licht en acht', groups: [4] },
    { id: 'woorden', name: 'Zonder plaatjes', hint: 'Echt, zacht en hij zegt', groups: [4] },
  ],
  makeQuestion(level) {
    if (level === 'plaatjes') return gapQuestion(pick(PIC), CHOICES, PROMPT);
    const word = Math.random() < 0.25 ? pick(UITZONDERING) : pickFrom(WORDS, PIC.map(([w]) => w));
    return gapQuestion([word], CHOICES, PROMPT);
  },
};
