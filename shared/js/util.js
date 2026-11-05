export const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
// Eerlijk husselen (Fisher-Yates), zodat het goede antwoord niet vaker op
// dezelfde plek staat.
export function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Voorlezen met een Nederlandse stem die op het apparaat zelf staat. Een
// online stem zou de tekst (soms met de naam van het kind) naar Google of
// Microsoft sturen. Is er geen eigen Nederlandse stem, dan verbergen we de
// 🔊-knoppen (via de klasse no-speech op <html>).
let voice = null;

function findVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith('nl') && v.localService) || null;
  document.documentElement.classList.toggle('no-speech', !voice);
}

if (typeof document !== 'undefined') {
  findVoice();
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.addEventListener?.('voiceschanged', findVoice);
}

export function speak(text) {
  if (!voice) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
