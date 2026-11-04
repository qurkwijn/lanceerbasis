import plusmin from './plusmin.js';
import tafels from './tafels.js';
import dubbelen from './dubbelen.js';
import { pick } from '../util.js';

// Een minuut lang zoveel mogelijk sommen die je al kent, zodat ze vanzelf gaan.
// De sommen komen van de andere planeten.
const LEVELS = {
  plus10: () => plusmin.makeQuestion('plus10'),
  min10: () => plusmin.makeQuestion('min10'),
  tot20: () => plusmin.makeQuestion(pick(['plus10', 'min10', 'tot20'])),
  over10: () => (Math.random() < 0.3 ? dubbelen.makeQuestion('bijna') : plusmin.makeQuestion('over10')),
  tafels: () => fast(tafels.makeQuestion('mix')),
  alletafels: () => fast(tafels.makeQuestion('alle')),
};

// Zonder stippen, dan blijft het snel.
function fast(q) {
  return { ...q, html: q.html.replace(/<div class="dot-groups"[\s\S]*$/, '') };
}

export default {
  intro: 'Je hebt <b>1 minuut</b>. Hoeveel sommen kun jij goed doen? Probeer elke keer je eigen record te verbeteren!',
  levels: [
    { id: 'plus10', name: 'Plus tot 10', hint: 'Race tegen de klok', groups: [3], timed: 60, starsAt: [8, 14] },
    { id: 'min10', name: 'Min tot 10', hint: 'Race tegen de klok', groups: [3], timed: 60, starsAt: [8, 14] },
    { id: 'tot20', name: 'Plus en min tot 20', hint: 'Race tegen de klok', groups: [3, 4], timed: 60, starsAt: [8, 14] },
    { id: 'over10', name: 'Over de 10', hint: 'Race tegen de klok', groups: [4], timed: 60, starsAt: [8, 14] },
    { id: 'tafels', name: 'Tafels', hint: 'Race tegen de klok', groups: [4], timed: 60, starsAt: [8, 14] },
    { id: 'alletafels', name: 'Alle tafels', hint: 'Race tegen de klok', groups: [5], timed: 60, starsAt: [10, 16] },
  ],

  makeQuestion(level) {
    return LEVELS[level]();
  },
};
