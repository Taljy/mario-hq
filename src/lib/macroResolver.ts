// macroResolver — liefert statischen Macro-Stub für Cover-MVP
// Live-Indizes-Anbindung kommt Phase 4/5

import data from '../data/macro.json';

export interface Index {
  name: string;
  delta_prozent: number;
}

export interface Macro {
  tagesthema: string;
  zeit: string;
  indizes: Index[];
}

export function getMacroHeute(): Macro {
  return data as Macro;
}
