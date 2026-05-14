// FOREX_DEFINITION — Display-Metadaten + API-Symbole für die Forex-Tabelle
// Quelle für /api/forex.ts (API-Calls) und ForexCommoditiesSektion.astro (UI)
// In 4.5b aus watchlist.json herausgelöst — Watchlist enthält ab 4.5b nur noch Krypto
// td_symbol-Format · Twelve Data erwartet Forex als Slash-Notation (EUR/USD)

export interface ForexDefinition {
  id:        string;
  symbol:    string;
  name:      string;
  td_symbol: string;
}

export const FOREX_DEFINITION: ForexDefinition[] = [
  { id: 'eur-usd', symbol: 'EUR/USD', name: 'Euro',           td_symbol: 'EUR/USD' },
  { id: 'chf-usd', symbol: 'CHF/USD', name: 'Franken',        td_symbol: 'CHF/USD' },
  { id: 'eur-chf', symbol: 'EUR/CHF', name: 'Euro / Franken', td_symbol: 'EUR/CHF' },
  { id: 'gbp-usd', symbol: 'GBP/USD', name: 'Pfund Sterling', td_symbol: 'GBP/USD' },
];
