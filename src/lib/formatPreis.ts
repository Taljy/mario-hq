// formatPreis — Zentraler Preis-Formatter für alle /wirtschaft-Komponenten
// Schweizer Apostroph via toLocaleString('de-CH') · $-Präfix immer gesetzt
// Dezimalstellen adaptiv nach Magnitude:
//   ≥ 1'000  → 0 Dez.  z.B. $79'794
//   ≥ 1      → 2 Dez.  z.B. $254.10 · $6'384.10
//   < 1      → 4 Dez.  z.B. $0.2650
// Kein Aufruf für tote Items (ist_live: false) — Caller zeigt dort "—"

export function formatPreis(p: number): string {
  if (p >= 1000) {
    return '$' + p.toLocaleString('de-CH', { maximumFractionDigits: 0 });
  }
  if (p >= 1) {
    return '$' + p.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + p.toLocaleString('de-CH', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}
