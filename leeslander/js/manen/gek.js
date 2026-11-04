import { pick } from '../../../shared/js/util.js';
import { pickFrom } from '../lezen.js';

// Klopt de zin, of is hij gek? Zo lees je echt wat er staat.
const KORT_KLOPT = ['Een vis zwemt in het water.', 'De zon is geel.', 'Een koe zegt boe.', 'IJs is koud.',
  'Een vogel kan vliegen.', 'Gras is groen.', 'In de nacht is het donker.', 'Een hond heeft vier poten.',
  'Je eet soep met een lepel.', 'Een auto heeft wielen.', 'Sneeuw is wit.', 'Je slaapt in een bed.',
  'Een kat zegt miauw.', 'Vuur is heet.', 'Een bij maakt honing.', 'Je hoort met je oren.',
  'Een eend kan zwemmen.', 'Een baby is klein.', 'Een sok trek je aan je voet.', 'Een boom heeft blaadjes.'];
const KORT_GEK = ['Een vis fietst naar school.', 'Een kat zegt boe.', 'IJs is heet.', 'Een hond heeft tien poten.',
  'Je eet soep met een vork.', 'Sneeuw is rood.', 'Je slaapt in de koelkast.', 'Een fiets kan praten.',
  'Een huis kan lopen.', 'De maan is van kaas.', 'Je ziet met je neus.', 'Een slak is heel snel.',
  'Gras is blauw.', 'Een boom zingt een liedje.', 'Een muis is groter dan een olifant.',
  'Je poetst je tanden met boter.', 'Een stoel eet een appel.', 'Een koe kan vliegen.', 'Een bal is vierkant.',
  'Een sok trek je aan je oor.'];

const LANG_KLOPT = ['Als het regent, word je nat zonder paraplu.', 'In de winter is het vaak koud buiten.',
  'Je doet een jas aan als het koud is.', 'Na maandag komt dinsdag.', 'Een pinguïn kan niet vliegen, maar wel zwemmen.',
  'Als je honger hebt, ga je iets eten.', 'Een week heeft zeven dagen.', 'Bloemen hebben water nodig om te groeien.',
  'In de nacht kun je de sterren zien.', 'Een brandweerman blust een brand.', 'In de bibliotheek kun je boeken lenen.',
  'Een slak draagt zijn huisje op zijn rug.', 'Een kuiken komt uit een ei.', 'In de zomer is het meestal warm.',
  'Een rups wordt later een vlinder.', 'Met een sleutel doe je de deur open.', 'Een tandarts kijkt naar je tanden.',
  'Een trein rijdt over de rails.', 'Als je moe bent, ga je naar bed.', 'Een giraf heeft een heel lange nek.'];
const LANG_GEK = ['Als het regent, wordt je haar heel droog.', 'In de zomer sneeuwt het elke dag.',
  'Je trekt een dikke jas aan om te gaan zwemmen.', 'Na maandag komt zondag.', 'Een pinguïn woont in de woestijn.',
  'Een week heeft twee dagen.', 'Bloemen groeien het best in de vriezer.', 'Een brandweerman blust een brand met limonade.',
  'In de bibliotheek kun je fietsen kopen.', 'Een slak rent sneller dan een paard.', 'Een kuiken komt uit een appel.',
  'Een vis klimt in een boom om te slapen.', 'Een vlinder wordt later een rups.', 'Met een lepel doe je de deur open.',
  'De tandarts kijkt naar je schoenen.', 'Een trein vaart over de zee.', 'Een giraf heeft een heel korte nek.',
  'Een sneeuwpop smelt in de vriezer.', 'Je eet je ontbijt vlak voor het slapengaan.', 'Een olifant past in je broekzak.'];

const LIST = { kort: [KORT_KLOPT, KORT_GEK], lang: [LANG_KLOPT, LANG_GEK] };

const CHOICES = [{ value: 'klopt', label: '👍 Klopt' }, { value: 'gek', label: '🙃 Gek!' }];

export default {
  intro: 'Lees de zin. Kan dat echt? Dan klopt hij. Kan het niet? Dan is het een gekke zin!',
  levels: [
    { id: 'kort', name: 'Korte zinnen', hint: 'Een koe zegt boe. Klopt dat?', groups: [3, 4] },
    { id: 'lang', name: 'Lange zinnen', hint: 'Na maandag komt zondag. Klopt dat?', groups: [4] },
  ],
  makeQuestion(level) {
    const [klopt, gek] = LIST[level];
    const sentence = pickFrom(klopt, gek);
    const answer = klopt.includes(sentence) ? 'klopt' : 'gek';
    return {
      key: sentence,
      prompt: 'Klopt het, of is het gek?',
      answer,
      choices: CHOICES,
      revealText: answer === 'klopt' ? 'Deze zin klopt echt!' : 'Dit kan niet, het is een gekke zin!',
      html: `<p class="read-card">${sentence}</p>`,
      onSolved(el) {
        el.querySelector('.read-card').insertAdjacentHTML('beforeend', ` <span aria-hidden="true">${answer === 'klopt' ? '👍' : pick(['🙃', '🤪', '😜'])}</span>`);
      },
    };
  },
};
