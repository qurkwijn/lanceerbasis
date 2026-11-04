import { startUrl } from './profile.js';
import { clearAll } from './store.js';

const FEEDBACK_MAIL = 'knoesss@gmail.com';

// Het i-knopje onderaan: info voor ouders over privacy en feedback.
export const INFO_FOOTER = `<footer class="app-footer">
  <button type="button" class="info-btn" data-info aria-label="Info, privacy en feedback">i</button>
</footer>`;

// Infoscherm voor ouders. Alles wat we beloven, moet ook echt kloppen met de
// code: alleen localStorage, geen account, geen tracking.
function showInfo(appName) {
  const subject = encodeURIComponent(`Feedback ${appName}`);
  const dialog = document.createElement('dialog');
  dialog.className = 'info-dialog';
  dialog.setAttribute('aria-labelledby', 'info-title');
  dialog.innerHTML = `
    <h2 id="info-title">Over ${appName}</h2>
    <p>De Lanceerbasis is een gratis oefenplek voor de basisschool, gemaakt door een ouder. Nu kun je in groep 3 en 4 rekenen met de Rekenraket, klokkijken, meten en met geld rekenen met de Meetrover, spelling oefenen met de Taaltelescoop, taal oefenen met de Zinnenzender en lezen met de Leeslander. De hogere groepen zijn nog in aanbouw.</p>
    <h3>Waar komt de lesstof vandaan?</h3>
    <p>Wat er per groep te oefenen is, volgt de kerndoelen voor rekenen en Nederlands (SLO, vernieuwd in 2026), de leerlijnen per groep en de methodes die de meeste scholen gebruiken, zoals Veilig leren lezen, Staal en De wereld in getallen. Elke school kiest zijn eigen methode, dus de volgorde kan bij jullie net anders zijn. Wat er precies in jouw groep zit, en waarom, zie je op de basis onder het knopje bij de voertuigen.</p>
    <h3>Gemaakt met AI</h3>
    <p>De oefeningen, woordenlijsten en verhaaltjes zijn gemaakt met hulp van AI (Claude). Ik controleer zo veel mogelijk, maar ik kan niet alles nakijken. Er kan dus een foutje in zitten, zoals een woord dat net anders gespeld wordt, een plaatje dat niet goed past of een vraag met een verkeerd antwoord.</p>
    <p>De Lanceerbasis is een extraatje om thuis te oefenen. Het vervangt de lessen en de methode van school niet. Twijfel je over een antwoord, ga dan uit van wat de juf of meester zegt.</p>
    <h3>Privacy</h3>
    <ul>
      <li>Je hoeft geen account te maken. We vragen geen e-mailadres of wachtwoord.</li>
      <li>De naam, de groep en de sterren worden alleen op dit apparaat bewaard. Ze worden nergens naartoe gestuurd.</li>
      <li>Geen reclame, geen cookies en we houden niet bij wie de app gebruikt.</li>
      <li>Een voornaam of bijnaam is genoeg.</li>
    </ul>
    <p class="info-small">De website staat op GitHub Pages en het lettertype komt van Google Fonts. Zoals bij elke website zien zij je IP-adres. Het adres lanceerbasis.app wordt beheerd bij Cloudflare, maar je bezoek gaat rechtstreeks naar GitHub. Voorlezen gebruikt de stem van je telefoon of browser.</p>
    <button type="button" class="btn info-clear" data-clear>Wis naam en sterren</button>
    <h3>Feedback</h3>
    <p>Een idee, of een foutje gevonden? Laat het weten, dan verbeter ik het!</p>
    <a class="btn primary" href="mailto:${FEEDBACK_MAIL}?subject=${subject}">✉️ Stuur een mailtje</a>
    <button type="button" class="btn info-close" data-close>Sluiten</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    // Tik naast het venster of op Sluiten om het te sluiten.
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
    if (e.target.closest('[data-clear]') && confirm('Weet je het zeker? De naam en alle sterren op dit apparaat worden gewist.')) {
      clearAll();
      dialog.close();
      // Staan we al op het startscherm, dan herladen we om de naam leeg te maken.
      if (location.href === startUrl()) location.reload();
      else location.href = startUrl();
    }
  });
  dialog.showModal();
}

// Eén keer aanroepen per pagina; daarna opent elk i-knopje het infoscherm.
export function setupInfo(appName) {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-info]')) showInfo(appName);
  });
}
