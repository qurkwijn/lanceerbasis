// De stations op de basis, elk met een eigen voertuig en wereld. Zonder
// `ready` staat een station nog "in aanbouw". `groups` zegt voor welke groepen
// het station er is; zo kan de basis per groep anders gevuld zijn.
// De volgorde is de volgorde op de basis, van links naar rechts.
export const STATIONS = [
  {
    id: 'taaltelescoop',
    name: 'Taaltelescoop',
    subject: 'Taal en spelling',
    world: 'de sterrenbeelden',
    groups: [3, 4],
    ready: true,
    art: telescope,
  },
  {
    id: 'rekenraket',
    name: 'Rekenraket',
    subject: 'Rekenen',
    world: 'de planeten',
    groups: [3, 4],
    ready: true,
    art: rocket,
  },
  {
    id: 'leeslander',
    name: 'Leeslander',
    subject: 'Lezen',
    world: 'de manen',
    groups: [3, 4],
    art: lander,
  },
];

// Raket op het lanceerplatform, met toren. De raket zelf heeft een eigen
// groep zodat hij los kan opstijgen.
function rocket() {
  return `<svg class="station-art" viewBox="0 0 120 170" aria-hidden="true">
    <g class="tower">
      <rect x="84" y="34" width="8" height="122" fill="#5a5f9e"/>
      <path d="M84 44 92 60 M92 44 84 60 M84 72 92 88 M92 72 84 88 M84 100 92 116 M92 100 84 116 M84 128 92 144 M92 128 84 144" stroke="#8a8fd0" stroke-width="2"/>
      <rect x="70" y="62" width="16" height="4" fill="#8a8fd0"/>
      <rect x="70" y="106" width="16" height="4" fill="#8a8fd0"/>
      <circle cx="88" cy="30" r="4" class="beacon" fill="#ff5a6a"/>
    </g>
    <g class="rocket">
      <path class="flame" d="M48 146 Q56 178 64 146 Z" fill="#ffcc33"/>
      <path class="flame" d="M51 146 Q56 166 61 146 Z" fill="#ff7a3c"/>
      <path d="M40 120 28 146 42 142 Z M72 120 84 146 70 142 Z" fill="#e8476a"/>
      <path d="M56 18 C74 38 76 90 72 144 H40 C36 90 38 38 56 18 Z" fill="#f4f1ff"/>
      <path d="M56 18 C63 26 67 34 69 42 H43 C45 34 49 26 56 18 Z" fill="#e8476a"/>
      <circle cx="56" cy="74" r="11" fill="#3a6fd8" stroke="#c0d4ff" stroke-width="4"/>
      <rect x="49" y="140" width="14" height="8" rx="2" fill="#9aa0c8"/>
      <rect x="44" y="104" width="24" height="5" rx="2" fill="#f08a4b"/>
    </g>
    <rect x="18" y="154" width="84" height="10" rx="3" fill="#3b4080"/>
    <rect x="30" y="148" width="10" height="8" fill="#3b4080"/>
    <rect x="72" y="148" width="10" height="8" fill="#3b4080"/>
  </svg>`;
}

// Sterrenwacht met koepel en telescoop.
function telescope() {
  return `<svg class="station-art" viewBox="0 0 120 170" aria-hidden="true">
    <rect x="22" y="96" width="76" height="62" rx="4" fill="#3b4080"/>
    <rect x="50" y="124" width="20" height="34" rx="10" fill="#262b6e"/>
    <rect x="30" y="108" width="12" height="10" rx="2" fill="#ffcc33" class="window"/>
    <rect x="78" y="108" width="12" height="10" rx="2" fill="#ffcc33" class="window"/>
    <path d="M18 98 A42 42 0 0 1 102 98 Z" fill="#c0d4ff"/>
    <path d="M60 56 A42 42 0 0 1 80 61 L68 98 H60 Z" fill="#7a86d8"/>
    <g class="scope">
      <rect x="58" y="44" width="12" height="44" rx="5" fill="#4a63c8" transform="rotate(32 64 88)"/>
      <rect x="56" y="40" width="16" height="10" rx="3" fill="#2a3a9a" transform="rotate(32 64 88)"/>
    </g>
    <rect x="14" y="156" width="92" height="8" rx="3" fill="#3b4080"/>
  </svg>`;
}

// Hangar met de maanlander erin.
function lander() {
  return `<svg class="station-art" viewBox="0 0 120 170" aria-hidden="true">
    <path d="M12 158 V104 A48 40 0 0 1 108 104 V158 Z" fill="#3b4080"/>
    <path d="M28 158 V112 A32 26 0 0 1 92 112 V158 Z" fill="#1b1f4b"/>
    <g class="lander-craft">
      <path d="M44 150 38 158 M76 150 82 158 M50 146 46 158 M70 146 74 158" stroke="#c9cde8" stroke-width="3" stroke-linecap="round"/>
      <rect x="42" y="134" width="36" height="16" rx="3" fill="#e0a33a"/>
      <path d="M46 134 C46 114 74 114 74 134 Z" fill="#d8dcf2"/>
      <circle cx="60" cy="126" r="5" fill="#3a6fd8"/>
    </g>
    <path d="M30 104 H90" stroke="#ffcc33" stroke-width="3" stroke-dasharray="6 5"/>
    <rect x="6" y="156" width="108" height="8" rx="3" fill="#3b4080"/>
  </svg>`;
}
