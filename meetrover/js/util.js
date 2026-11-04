export { escapeHtml, pick, rand, shuffle } from '../../shared/js/util.js';

// Een invulvakje midden in een som, zoals "8 + [?] = 13".
export const slot = (extra = '') => `<span class="slot slot-inline ${extra}"></span>`;
