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
    <h2 id="info-title" tabindex="-1" autofocus>Over ${appName}</h2>
    <p>Een gratis oefenplek voor groep 3 en 4, gemaakt door een ouder. De hogere groepen zijn in aanbouw.</p>
    <h3>Lesstof</h3>
    <p>Gebaseerd op de kerndoelen, de leerlijnen per groep en veelgebruikte methodes. De volgorde op school kan net anders zijn.</p>
    <h3>Gemaakt met AI</h3>
    <p>De oefeningen zijn gemaakt met hulp van AI (Claude). Ik controleer veel, maar er kan een foutje in zitten. Het is een extraatje en vervangt school niet: bij twijfel heeft de juf of meester gelijk.</p>
    <h3>Privacy</h3>
    <ul>
      <li>Geen account, geen reclame, geen cookies en geen tracking.</li>
      <li>Naam, groep en sterren blijven op dit apparaat. Een voornaam of bijnaam is genoeg.</li>
    </ul>
    <p class="info-small">De site staat op GitHub Pages (het adres loopt via Cloudflare) en het lettertype komt van Google Fonts. Zij zien je IP-adres. Voorlezen gebruikt de stem van je apparaat.</p>
    <p>Een idee of een foutje gevonden? Laat het weten!</p>
    <div class="info-actions">
      <a class="btn primary" href="mailto:${FEEDBACK_MAIL}?subject=${subject}">✉️ Mail</a>
      <button type="button" class="btn info-clear" data-clear>Wis naam en sterren</button>
    </div>
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
