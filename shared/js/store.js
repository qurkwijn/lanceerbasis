// Eén plek in localStorage voor de hele Lanceerbasis: het profiel (naam en
// groep) en de sterren van alle apps. Alles in try/catch: in een privévenster
// kan opslag ontbreken.
const KEY = 'lanceerbasis:v1';
// Rekenraket stond eerst los op hetzelfde domein. Wat daar bewaard is, nemen
// we één keer over.
const OLD_REKENRAKET = 'rekenraket:v1';

// Alleen een gewoon object telt; alles anders (kapot of vreemd) is niets.
function read(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function fromRekenraket() {
  const old = read(OLD_REKENRAKET);
  if (!old) return null;
  const stars = {};
  for (const [id, n] of Object.entries(old.stars || {})) {
    // Sterren van vóór de groepkeuze horen bij groep 4.
    const key = `rekenraket:${id.includes(':') ? id : `g4:${id}`}`;
    stars[key] = Math.max(stars[key] || 0, n);
  }
  return { profile: old.profile, stars };
}

export function load() {
  return read(KEY) || fromRekenraket() || {};
}

// Geeft terug of het gelukt is. Mislukt het, dan wordt het alleen niet bewaard.
export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

// Voor de knop "Wis naam en sterren" in het infoscherm.
export function clearAll() {
  for (const key of [KEY, OLD_REKENRAKET]) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Dan was er ook niets bewaard.
    }
  }
}
