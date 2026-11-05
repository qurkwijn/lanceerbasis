import { BREEDTE, EILAND_PADEN, HOOGTE, PADEN, punt } from './kaartdata.js';

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

// Grote steden: naam, provincie en plek [noorderbreedte, oosterlengte].
export const STEDEN = [['Amsterdam', 'nh', [52.37, 4.90]], ['Rotterdam', 'zh', [51.92, 4.48]], ['Den Haag', 'zh', [52.08, 4.30]],
  ['Utrecht', 'ut', [52.09, 5.12]], ['Eindhoven', 'nb', [51.44, 5.48]], ['Tilburg', 'nb', [51.56, 5.09]],
  ['Groningen', 'gr', [53.22, 6.57]], ['Almere', 'fl', [52.37, 5.21]], ['Breda', 'nb', [51.59, 4.78]],
  ['Nijmegen', 'ge', [51.84, 5.86]], ['Apeldoorn', 'ge', [52.21, 5.97]], ['Enschede', 'ov', [52.22, 6.89]],
  ['Haarlem', 'nh', [52.38, 4.64]], ['Arnhem', 'ge', [51.98, 5.91]], ['Amersfoort', 'ut', [52.16, 5.39]],
  ['Zwolle', 'ov', [52.52, 6.09]], ['Leiden', 'zh', [52.16, 4.49]], ['Maastricht', 'li', [50.85, 5.69]],
  ['Dordrecht', 'zh', [51.81, 4.67]], ['Venlo', 'li', [51.37, 6.17]], ['Leeuwarden', 'fr', [53.20, 5.80]],
  ['Assen', 'dr', [52.99, 6.56]], ['Emmen', 'dr', [52.79, 6.90]], ['Middelburg', 'ze', [51.50, 3.61]],
  ['Vlissingen', 'ze', [51.44, 3.57]], ['Lelystad', 'fl', [52.52, 5.47]], ['Deventer', 'ov', [52.25, 6.16]],
  ['Alkmaar', 'nh', [52.63, 4.75]], ['Delft', 'zh', [52.01, 4.36]], ['Heerlen', 'li', [50.89, 5.98]],
  ['Sneek', 'fr', [53.03, 5.66]], ['Goes', 'ze', [51.50, 3.89]], ["'s-Hertogenbosch", 'nb', [51.69, 5.30]]];

export const stad = (name) => STEDEN.find(([n]) => n === name);

// De Waddeneilanden van west naar oost: TV TAS. Met provincie en plek.
export const EILANDEN = [['Texel', 'nh', [53.08, 4.80]], ['Vlieland', 'fr', [53.27, 5.03]], ['Terschelling', 'fr', [53.39, 5.35]],
  ['Ameland', 'fr', [53.45, 5.75]], ['Schiermonnikoog', 'fr', [53.48, 6.20]]];

// De grote rivieren, als lijn van punten. Een benadering: goed genoeg om te
// zien waar ze lopen, niet om op te varen.
export const RIVIEREN = {
  Rijn: [[51.87, 6.15], [51.88, 6.03], [51.97, 5.90], [51.96, 5.66], [51.97, 5.35], [51.97, 5.10], [51.92, 4.85],
    [51.88, 4.64], [51.90, 4.48], [51.98, 4.12]],
  Waal: [[51.88, 6.03], [51.85, 5.86], [51.89, 5.43], [51.83, 5.00], [51.81, 4.67]],
  Maas: [[50.75, 5.70], [50.85, 5.69], [51.00, 5.79], [51.19, 5.99], [51.37, 6.17], [51.60, 6.05], [51.75, 5.85],
    [51.76, 5.53], [51.74, 5.27], [51.72, 5.00], [51.72, 4.80], [51.75, 4.62]],
  IJssel: [[51.95, 5.98], [52.14, 6.19], [52.25, 6.16], [52.42, 6.07], [52.52, 5.95], [52.58, 5.83]],
  Schelde: [[51.36, 4.25], [51.38, 4.05], [51.43, 3.85], [51.44, 3.57]],
};

const xy = (pos) => punt(pos).map((n) => n.toFixed(1)).join(' ');

// De kaart. `mark` kleurt provincies op ({ gr: 'var(--accent)' }); de rest
// wordt dan grijs. Zonder `mark` heeft elke provincie haar eigen kleur.
// `islands` laat de Waddeneilanden zien, `island` licht er één op met een
// ring eromheen. `rivers` tekent de rivieren, `river` licht er één op.
// `dots` zet stippen op plekken [noorderbreedte, oosterlengte].
export function mapSvg({ mark = null, islands = false, island = null, rivers = false, river = null, dots = [], compass = false } = {}) {
  const fill = (p) => (!mark ? p.color : mark[p.id] || 'rgba(255, 255, 255, 0.22)');
  const provincies = PROVINCIES.map((p) => `<path d="${PADEN[p.id]}" fill="${fill(p)}" class="prov"/>`).join('');
  const lines = rivers || river ? Object.entries(RIVIEREN).map(([name, pts]) =>
    `<polyline points="${pts.map(xy).join(' ')}" class="river${name === river ? ' on' : ''}"/>`).join('') : '';
  const isles = islands || island ? EILANDEN.map(([name]) =>
    `<path d="${EILAND_PADEN[name]}" class="isle${name === island ? ' on' : ''}"/>`).join('') : '';
  const spots = [...dots, ...(island ? [EILANDEN.find(([n]) => n === island)[2]] : [])].map((pos) => {
    const [x, y] = punt(pos);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="spot-ring"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" class="spot"/>`;
  }).join('');
  return `<svg class="nl-map" viewBox="0 0 ${BREEDTE} ${HOOGTE}" role="img" aria-label="Kaart van Nederland">
    <rect x="0" y="0" width="${BREEDTE}" height="${HOOGTE}" rx="14" class="sea"/>
    <text x="14" y="120" class="sea-label" transform="rotate(-90 14 120)">Noordzee</text>
    ${provincies}${lines}${isles}${spots}
    ${compass ? `<g class="compass" transform="translate(${BREEDTE - 16} 150)"><path d="M0 -10 L4 0 L0 10 L-4 0 Z"/><text y="-13">N</text></g>` : ''}
  </svg>`;
}
