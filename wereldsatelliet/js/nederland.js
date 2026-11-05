import { BREEDTE, EILAND_PADEN, HOOGTE, PADEN } from './kaartdata.js';

// De twaalf provincies. De vormen staan in kaartdata.js (open data van het
// CBS). `pos` is het midden van de provincie in [noorderbreedte,
// oosterlengte], voor de windrichtingen. `water` zijn provincies waarmee de
// grens alleen door het water loopt; die vragen we niet als buur, maar ook
// niet als fout antwoord.
export const PROVINCIES = [
  { id: 'gr', name: 'Groningen', hoofdstad: 'Groningen', pos: [53.2, 6.7], color: '#9fd3ff', buren: ['fr', 'dr'], water: [] },
  { id: 'fr', name: 'Friesland', hoofdstad: 'Leeuwarden', pos: [53.1, 5.8], color: '#8af0b0', buren: ['gr', 'dr', 'ov', 'fl'], water: ['nh'] },
  { id: 'dr', name: 'Drenthe', hoofdstad: 'Assen', pos: [52.9, 6.6], color: '#ffd76e', buren: ['gr', 'fr', 'ov'], water: [] },
  { id: 'nh', name: 'Noord-Holland', hoofdstad: 'Haarlem', pos: [52.6, 4.85], color: '#ff9ecb', buren: ['ut', 'zh'], water: ['fl', 'fr'] },
  { id: 'fl', name: 'Flevoland', hoofdstad: 'Lelystad', pos: [52.5, 5.6], color: '#c4b0ff', buren: ['fr', 'ov', 'ge'], water: ['nh', 'ut'] },
  { id: 'ov', name: 'Overijssel', hoofdstad: 'Zwolle', pos: [52.45, 6.45], color: '#ffb36b', buren: ['fr', 'dr', 'fl', 'ge'], water: [] },
  { id: 'ut', name: 'Utrecht', hoofdstad: 'Utrecht', pos: [52.08, 5.2], color: '#ff8fa3', buren: ['nh', 'zh', 'ge'], water: ['fl'] },
  { id: 'zh', name: 'Zuid-Holland', hoofdstad: 'Den Haag', pos: [52.0, 4.5], color: '#a8e6a1', buren: ['nh', 'ut', 'ge', 'nb', 'ze'], water: [] },
  { id: 'ge', name: 'Gelderland', hoofdstad: 'Arnhem', pos: [52.05, 5.9], color: '#ffd1a6', buren: ['ov', 'fl', 'ut', 'zh', 'nb', 'li'], water: [] },
  { id: 'ze', name: 'Zeeland', hoofdstad: 'Middelburg', pos: [51.5, 3.85], color: '#8af5e8', buren: ['zh', 'nb'], water: [] },
  { id: 'nb', name: 'Noord-Brabant', hoofdstad: "'s-Hertogenbosch", pos: [51.55, 5.1], color: '#d2b0ff', buren: ['ze', 'zh', 'ge', 'li'], water: [] },
  { id: 'li', name: 'Limburg', hoofdstad: 'Maastricht', pos: [51.2, 5.9], color: '#f5d76e', buren: ['nb', 'ge'], water: [] },
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

// De kaart. `mark` kleurt provincies op ({ gr: 'var(--accent)' }); de rest
// wordt dan grijs. Zonder `mark` heeft elke provincie haar eigen kleur.
// `islands` laat de Waddeneilanden oplichten, met eventueel één eiland extra.
export function mapSvg({ mark = null, islands = false, island = null, compass = false } = {}) {
  const fill = (p) => (!mark ? p.color : mark[p.id] || 'rgba(255, 255, 255, 0.22)');
  const provincies = PROVINCIES.map((p) => `<path d="${PADEN[p.id]}" fill="${fill(p)}" class="prov"/>`).join('');
  const isles = islands ? EILANDEN.map(([name]) =>
    `<path d="${EILAND_PADEN[name]}" class="isle${name === island ? ' on' : ''}"/>`).join('') : '';
  return `<svg class="nl-map" viewBox="0 0 ${BREEDTE} ${HOOGTE}" role="img" aria-label="Kaart van Nederland">
    <rect x="0" y="0" width="${BREEDTE}" height="${HOOGTE}" rx="14" class="sea"/>
    <text x="14" y="120" class="sea-label" transform="rotate(-90 14 120)">Noordzee</text>
    ${provincies}${isles}
    ${compass ? `<g class="compass" transform="translate(${BREEDTE - 16} 150)"><path d="M0 -10 L4 0 L0 10 L-4 0 Z"/><text y="-13">N</text></g>` : ''}
  </svg>`;
}
