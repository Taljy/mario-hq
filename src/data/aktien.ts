// AKTIEN_DEFINITION — Display-Metadaten + API-Symbole für die Aktien-Sektion
// Quelle für /api/aktien.ts (API-Calls) und AktienSektion.astro (UI-Rendering)
// In 4.5b aus watchlist.json herausgelöst — Watchlist enthält ab 4.5b nur noch Krypto

export interface AktieDefinition {
  id:        string;  // intern · auch der Key im TwelveDataStand-Response
  symbol:    string;  // Display, z.B. "AAPL"
  name:      string;  // z.B. "Apple"
  td_symbol: string;  // an Twelve Data übergeben, z.B. "AAPL"
}

export const AKTIEN_DEFINITION: AktieDefinition[] = [
  { id: 'aapl', symbol: 'AAPL', name: 'Apple',     td_symbol: 'AAPL' },
  { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA',    td_symbol: 'NVDA' },
  { id: 'tsla', symbol: 'TSLA', name: 'Tesla',     td_symbol: 'TSLA' },
  { id: 'msft', symbol: 'MSFT', name: 'Microsoft', td_symbol: 'MSFT' },
  { id: 'amzn', symbol: 'AMZN', name: 'Amazon',    td_symbol: 'AMZN' },
  { id: 'meta', symbol: 'META', name: 'Meta',      td_symbol: 'META' },
];
