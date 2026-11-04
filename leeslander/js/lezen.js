import { pick } from '../../shared/js/util.js';

// Kies eerlijk tussen lijsten, zodat bijvoorbeeld "klopt" en "gek" ongeveer
// even vaak voorkomen.
export const pickFrom = (...lists) => pick(pick(lists));
