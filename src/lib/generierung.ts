// generierung — Briefing-Generierungs-Metadaten
// In Phase 5 ersetzt Cowork diese Werte mit echten Timestamps
// Für Cover-MVP statisch

export interface Generierung {
  zeit: string;        // "06:30 CEST" — tägl. Generierungszeit
  live_btc_zeit: string;  // "14:22 CEST" — letzter Live-BTC-Abruf
}

export function getGenerierung(): Generierung {
  return {
    zeit: '06:30 CEST',
    live_btc_zeit: '14:22 CEST',
  };
}
