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
    <p>De Lanceerbasis is een gratis oefenplek voor de basisschool, gemaakt door een ouder. Nu kun je met de Rekenraket rekenen oefenen in groep 3 en 4. Taal, lezen en de hogere groepen zijn nog in aanbouw.</p>
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
    <p>Een idee, een foutje of een vraag die niet klopt? Laat het weten!</p>
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
