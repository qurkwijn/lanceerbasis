import { pick, rand, shuffle } from '../../../shared/js/util.js';

// Het alfabet: welke letter komt erna, en welk woord staat eerst in het
// woordenboek?
const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');

const WOORDEN = ['aap', 'bal', 'boom', 'citroen', 'deur', 'eend', 'fiets', 'geit', 'hond', 'ijs', 'jas', 'kat', 'lamp',
  'maan', 'neus', 'oor', 'pen', 'quiz', 'roos', 'sok', 'tent', 'uil', 'vis', 'wolk', 'xylofoon', 'yoghurt', 'zon',
  'appel', 'beer', 'duim', 'fluit', 'giraf', 'huis', 'kip', 'muis', 'peer', 'raket', 'slak', 'trein', 'vlag', 'zebra'];

function next() {
  const i = rand(0, ABC.length - 2);
  const answer = ABC[i + 1];
  const others = shuffle(ABC.filter((l) => l !== answer && l !== ABC[i])).slice(0, 2);
  const before = ABC.slice(Math.max(0, i - 2), i + 1);
  return {
    key: `na-${ABC[i]}`,
    prompt: `Welke letter komt na de ${ABC[i]}?`,
    answer,
    choices: shuffle([answer, ...others]),
    revealText: `Na de ${ABC[i]} komt de ${answer}.`,
    html: `<div class="abc-row">${before.map((l) => `<span>${l}</span>`).join('')}<span class="gap">?</span></div>`,
  };
}

function first() {
  const words = [];
  while (words.length < 3) {
    const w = pick(WOORDEN);
    if (!words.some((o) => o[0] === w[0])) words.push(w);
  }
  const answer = [...words].sort()[0];
  return {
    key: `eerst-${words.sort().join('-')}`,
    prompt: 'Welk woord komt het eerst in het alfabet?',
    answer,
    choices: shuffle(words),
    revealText: `${answer} begint met een ${answer[0]}, die komt het eerst.`,
    html: '<div class="abc-row abc-hint">a b c d e f g h i j k l m n o p q r s t u v w x y z</div>',
  };
}

export default {
  intro: 'Het alfabet is de rij van alle letters: <b>a b c d e…</b> tot de <b>z</b>. In het woordenboek staan de woorden in die volgorde.',
  levels: [
    { id: 'erna', name: 'Welke letter komt erna?', hint: 'a, b, c, ?', groups: [3, 4] },
    { id: 'woorden', name: 'Welk woord eerst?', hint: 'Zoals in het woordenboek', groups: [4] },
  ],
  makeQuestion(level) {
    return level === 'erna' ? next() : first();
  },
};
