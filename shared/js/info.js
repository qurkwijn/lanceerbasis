import { startUrl } from './profile.js';
import { clearAll } from './store.js';

const FEEDBACK_MAIL = 'feedback@lanceerbasis.app';
const REPO_URL = 'https://github.com/qurkwijn/lanceerbasis';

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
    <p>Een gratis oefenplek voor groep 3 tot en met 5, gemaakt door een ouder. De hogere groepen zijn in aanbouw.</p>
    <h3>Lesstof</h3>
    <p>Gebaseerd op de kerndoelen, de leerlijnen per groep en veelgebruikte methodes. De volgorde op school kan net anders zijn.</p>
    <h3>Gemaakt met AI</h3>
    <p>De oefeningen zijn gemaakt met hulp van AI (Claude). Ik controleer veel, maar er kan een foutje in zitten. Het is een extraatje en vervangt school niet: bij twijfel heeft de juf of meester gelijk.</p>
    <h3>Privacy</h3>
    <ul>
      <li>Geen account, geen reclame, geen cookies en geen tracking.</li>
      <li>Naam, groep en sterren blijven op dit apparaat. Een voornaam of bijnaam is genoeg.</li>
    </ul>
    <p>Een idee of een foutje gevonden? Laat het weten!</p>
    <div class="info-actions">
      <a class="btn primary" href="mailto:${FEEDBACK_MAIL}?subject=${subject}">✉️ Mail</a>
      <button type="button" class="btn info-clear" data-clear>Wis naam en sterren</button>
      <button type="button" class="btn info-nerd-btn" data-nerd>🤓 Onder de motorkap</button>
    </div>
    <button type="button" class="btn info-close" data-close>Sluiten</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    // Tik naast het venster of op Sluiten om het te sluiten.
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
    if (e.target.closest('[data-nerd]')) showNerdInfo();
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

// Tweede venster, boven op het infoscherm: de techniek, voor ouders die in de
// IT werken of gewoon nieuwsgierig zijn. Sluiten brengt je terug naar de info.
function showNerdInfo() {
  const dialog = document.createElement('dialog');
  dialog.className = 'info-dialog';
  dialog.setAttribute('aria-labelledby', 'nerd-title');
  dialog.innerHTML = `
    <h2 id="nerd-title" tabindex="-1" autofocus>🤓 Onder de motorkap</h2>
    <p>Voor wie wil weten hoe het werkt.</p>
    <ul>
      <li><strong>Bouw:</strong> gewone HTML, CSS en JavaScript-modules. Geen framework, geen npm-pakketten en geen build-stap.</li>
      <li><strong>Beveiliging:</strong> een strenge Content-Security-Policy. De pagina laadt alleen bestanden van de site zelf, geen scripts of verzoeken van buiten.</li>
      <li><strong>Opslag:</strong> alles staat in <code>localStorage</code> onder <code>lanceerbasis:v1</code>. Er is geen server en geen database.</li>
      <li><strong>Hosting:</strong> GitHub Pages met een eigen domein. GitHub ziet je IP-adres, zoals bij elke website.</li>
      <li><strong>Lettertype:</strong> Baloo 2 (SIL Open Font License), zelf gehost als woff2. Er gaat dus niets naar Google Fonts.</li>
      <li><strong>Voorlezen:</strong> de Web Speech API, alleen met een Nederlandse stem die op je eigen apparaat staat. Een online stem zou de tekst naar Google of Microsoft sturen; is er geen eigen stem, dan verdwijnen de 🔊-knoppen.</li>
      <li><strong>Kaart:</strong> provinciegrenzen van het CBS (open data, CC BY 4.0), getekend als SVG.</li>
      <li><strong>Oefeningen:</strong> worden telkens willekeurig gemaakt. Een testscript laat per onderdeel, niveau en groep honderden vragen maken en controleert of ze kloppen.</li>
      <li><strong>Gemaakt met:</strong> Claude Code van Anthropic, met een ouder aan het stuur.</li>
    </ul>
    <p>De code staat openbaar op <a href="${REPO_URL}" target="_blank" rel="noopener">GitHub</a>. Neem gerust een kijkje.</p>
    <button type="button" class="btn info-close" data-close>Terug</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog.showModal();
}

// Eén keer aanroepen per pagina; daarna opent elk i-knopje het infoscherm.
export function setupInfo(appName) {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-info]')) showInfo(appName);
  });
}
