// Nederland als blokjeskaart: elke provincie is een blok op ongeveer de goede
// plek. Zo zie je meteen wat noord, oost, zuid en west is, zonder echte
// grenzen te hoeven tekenen. `tile` is [kolom, rij, breedte, hoogte] in
// blokjes. `pos` is het midden van de provincie in [noorderbreedte,
// oosterlengte], voor de windrichtingen. `water` zijn provincies waarmee de
// grens alleen door het water loopt; die vragen we niet als buur, maar ook
// niet als fout antwoord.
export const PROVINCIES = [
  { id: 'gr', name: 'Groningen', hoofdstad: 'Groningen', tile: [3, 0, 1, 1], pos: [53.2, 6.7], color: '#9fd3ff', buren: ['fr', 'dr'], water: [] },
  { id: 'fr', name: 'Friesland', hoofdstad: 'Leeuwarden', tile: [2, 0, 1, 1], pos: [53.1, 5.8], color: '#8af0b0', buren: ['gr', 'dr', 'ov', 'fl'], water: ['nh'] },
  { id: 'dr', name: 'Drenthe', hoofdstad: 'Assen', tile: [3, 1, 1, 1], pos: [52.9, 6.6], color: '#ffd76e', buren: ['gr', 'fr', 'ov'], water: [] },
  { id: 'nh', name: 'Noord-Holland', hoofdstad: 'Haarlem', tile: [1, 0, 1, 2], pos: [52.6, 4.85], color: '#ff9ecb', buren: ['ut', 'zh'], water: ['fl', 'fr'] },
  { id: 'fl', name: 'Flevoland', hoofdstad: 'Lelystad', tile: [2, 1, 1, 1], pos: [52.5, 5.6], color: '#c4b0ff', buren: ['fr', 'ov', 'ge'], water: ['nh', 'ut'] },
  { id: 'ov', name: 'Overijssel', hoofdstad: 'Zwolle', tile: [3, 2, 1, 1], pos: [52.45, 6.45], color: '#ffb36b', buren: ['fr', 'dr', 'fl', 'ge'], water: [] },
  { id: 'ut', name: 'Utrecht', hoofdstad: 'Utrecht', tile: [2, 2, 1, 1], pos: [52.08, 5.2], color: '#ff8fa3', buren: ['nh', 'zh', 'ge'], water: ['fl'] },
  { id: 'zh', name: 'Zuid-Holland', hoofdstad: 'Den Haag', tile: [1, 2, 1, 2], pos: [52.0, 4.5], color: '#a8e6a1', buren: ['nh', 'ut', 'ge', 'nb', 'ze'], water: [] },
  { id: 'ge', name: 'Gelderland', hoofdstad: 'Arnhem', tile: [2, 3, 2, 1], pos: [52.05, 5.9], color: '#ffd1a6', buren: ['ov', 'fl', 'ut', 'zh', 'nb', 'li'], water: [] },
  { id: 'ze', name: 'Zeeland', hoofdstad: 'Middelburg', tile: [0, 4, 1, 1], pos: [51.5, 3.85], color: '#8af5e8', buren: ['zh', 'nb'], water: [] },
  { id: 'nb', name: 'Noord-Brabant', hoofdstad: "'s-Hertogenbosch", tile: [1, 4, 2, 1], pos: [51.55, 5.1], color: '#d2b0ff', buren: ['ze', 'zh', 'ge', 'li'], water: [] },
  { id: 'li', name: 'Limburg', hoofdstad: 'Maastricht', tile: [3, 4, 1, 2], pos: [51.2, 5.9], color: '#f5d76e', buren: ['nb', 'ge'], water: [] },
];

export const byId = (id) => PROVINCIES.find((p) => p.id === id);

// Grote steden en de provincie waar ze liggen.
export const STEDEN = [['Amsterdam', 'nh'], ['Rotterdam', 'zh'], ['Den Haag', 'zh'], ['Utrecht', 'ut'], ['Eindhoven', 'nb'],
  ['Tilburg', 'nb'], ['Groningen', 'gr'], ['Almere', 'fl'], ['Breda', 'nb'], ['Nijmegen', 'ge'], ['Apeldoorn', 'ge'],
  ['Enschede', 'ov'], ['Haarlem', 'nh'], ['Arnhem', 'ge'], ['Amersfoort', 'ut'], ['Zwolle', 'ov'], ['Leiden', 'zh'],
  ['Maastricht', 'li'], ['Dordrecht', 'zh'], ['Venlo', 'li'], ['Leeuwarden', 'fr'], ['Assen', 'dr'], ['Emmen', 'dr'],
  ['Middelburg', 'ze'], ['Vlissingen', 'ze'], ['Lelystad', 'fl'], ['Deventer', 'ov'], ['Alkmaar', 'nh'], ['Delft', 'zh'],
  ['Heerlen', 'li'], ['Sneek', 'fr'], ['Goes', 'ze']];

// De Waddeneilanden van west naar oost: TV TAS.
export const EILANDEN = [['Texel', 'nh'], ['Vlieland', 'fr'], ['Terschelling', 'fr'], ['Ameland', 'fr'], ['Schiermonnikoog', 'fr']];

const TILE = 30;
const GAP = 3;
const LEFT = 26;
const TOP = 30;

const box = ([c, r, w, h]) => ({
  x: LEFT + c * TILE, y: TOP + r * TILE, w: w * TILE - GAP, h: h * TILE - GAP,
});

// De kaart. `mark` kleurt provincies op ({ gr: 'var(--accent)' }); de rest
// wordt dan grijs. Zonder `mark` heeft elke provincie haar eigen kleur.
// `islands` laat de Waddeneilanden zien, met eventueel één eiland opgelicht.
export function mapSvg({ mark = null, islands = false, island = null, compass = false } = {}) {
  const fill = (p) => (!mark ? p.color : mark[p.id] || 'rgba(255, 255, 255, 0.14)');
  const tiles = PROVINCIES.map((p) => {
    const b = box(p.tile);
    return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6" fill="${fill(p)}"/>`;
  }).join('');
  const isles = islands ? EILANDEN.map(([name], i) =>
    `<ellipse cx="${LEFT + 30 + i * 18}" cy="${TOP - 14}" rx="7" ry="3.5" class="isle${name === island ? ' on' : ''}"/>`).join('') : '';
  return `<svg class="nl-map" viewBox="0 0 160 220" role="img" aria-label="Kaart van Nederland in blokjes">
    <rect x="0" y="0" width="160" height="220" rx="16" class="sea"/>
    <text x="12" y="120" class="sea-label" transform="rotate(-90 12 120)">Noordzee</text>
    ${tiles}
    <circle cx="${LEFT + 2 * TILE - GAP / 2}" cy="${TOP + TILE - GAP / 2}" r="7" class="lake"/>
    ${isles}
    ${compass ? '<g class="compass" transform="translate(146 24)"><path d="M0 -10 L4 0 L0 10 L-4 0 Z"/><text y="-13">N</text></g>' : ''}
  </svg>`;
}
