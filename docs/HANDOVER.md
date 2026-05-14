---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.8 begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.7

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app (kanonisch)

Mario: Architekturfotograf, Swing-Trader, Schweizer Hochdeutsch, du-Form.

---

## 2 · Wo wir gerade stehen

**Phase 4** (Charts + Trading-Watchlist) · KURZ VOR ABSCHLUSS

Phase-4-Slice-Status:
- Slice 4.1 ✅ ECharts-Foundation + BTC-Sparkline
- Slice 4.2 ✅ Trading-Indikatoren-Block (Production-Binance-Fallback ist offen)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation
- Slice 4.4 ✅ Watchlist-UI-Komponenten + Mini-Sparklines
- Slice 4.5 ✅ Aktien + Forex-Sektion · Twelve-Data-Endpoint-Architektur
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard (Zwischen-Slice)
- Slice 4.5c ✅ Daten-Architektur-Cleanup · kryptoAggregator (Zwischen-Slice)
- Spec-Sync ✅ Phase-4-Spec an Realität angeglichen + Eyebrow
- Slice 4.6 ✅ Wetter-Wochen-Bars + Mondphase-SVG auf /wetter
- Slice 4.7 ✅ Macro-Timeline + Fear & Greed Gauge auf /wirtschaft
- **Slice 4.8 ← NÄCHSTER SCHRITT · PHASE-4-ABSCHLUSS** · Polish + Volltest + Spec-Sync (Spec §7.8)

Commits Slice 4.7: feat `1ba75f1` · docs ausstehend (mit diesem Handover-Push)

**/wirtschaft ist jetzt komplett:** KryptoHero · TradingIndikatoren · KryptoSektion
(zwei Blöcke + AssetCard, collapsible) · AktienSektion · ForexCommoditiesSektion ·
MacroTimeline (9 Events 14.5.-28.5., heute mit Vermillon-Balken) · FearGreedGauge
(34 "Fear" · Halbkreis-Tacho, kein Grün) · News · TradeSetupsPlaceholder.

**/wetter ist komplett:** WetterDetail · WetterWochenBars (ECharts) ·
AstronomieSektion (mit Mondphase-SVG, mathematisch korrekt) · FotoSpots.

---

## 3 · Nächster Schritt · Slice 4.8 · Polish + Phase-4-Abschluss

**Spec §7.8.** Letzter Phase-4-Slice. Reine Aufräum- und Verifizierungsarbeit
plus Abschluss-Doku.

**Tasks laut Spec:**
- /wirtschaft visuell durchgehen · Sektion-Ordnung, Spacing, Eyebrow-Konsistenz
- Mobile-Volltest mit Scrolling-Verhalten der langen Page
- Dark-Mode-Volltest
- Performance-Check: Lighthouse-Spot-Check (Performance, Accessibility, Best Practices)
- ECharts-Bundle-Size verifizieren (sollte ~250KB sein, nur auf /wirtschaft +
  /wetter geladen, nicht global)
- _pendenzen.md auf "Phase 4 abgeschlossen" markieren
- SESSION_LOG-Eintrag mit Phase-4-Synthese (alle Slices + Erkenntnisse zusammengefasst)

**Plus offene Spec-Sync-Punkte:**
- **§7.7-Realitäts-Notiz für MacroTimeline = Editorial-Liste** (statt ECharts-
  Zeitachse, Begründung: Label-Kollisionen) — in 4.7 dokumentiert, hier in §7.7
  als Realitäts-Box am Anfang ergänzen, analog wie §7.3/§7.4/§7.5 schon gesync't sind
- **§5 Komponenten-Liste** um die neuen 4.6 + 4.7-Komponenten ergänzen (WetterWochenBars,
  MondphaseSvg, MacroTimeline, FearGreedGauge, macroEventsResolver, fearGreedFetcher,
  macro-events.json)
- **§3 Modul-Tabelle** Update: Fear & Greed Gauge und Macro-Timeline auf ✅, Slice-
  Spalte aktualisieren

**Mini-Aufgaben einschiebbar (siehe §5/§6):**
- Cover-Phasen-Stempel "PHASE 2.2" → "Phase 4"
- Vercel-Doppel-Projekt: `mario-hq` (ohne Custom Domain) gefahrlos löschen
- Vercel-Binance-Block diagnostizieren (4 Trading-Indikator-Cards Fallback auf Production)

**Geschätzter Umfang:** klein-mittel · überwiegend Doku + Verifizierung +
ein paar Kleinkorrekturen falls beim Volltest etwas auffällt.

**Keine API-Calls nötig** (Twelve Data + CoinGecko schonen).

---

## 4 · Bekannte Production-Issues (alle nicht blockierend für 4.8)

- **5.1 Vercel blockt Binance-API** · 4 Trading-Indikator-Cards Fallback auf Production. Geo-/IP-Block. → Mini-Reparatur-Slice oder akzeptieren.
- **5.2 Vercel-Doppel-Projekt** · `mario-hq` (ohne Domain) kann gefahrlos gelöscht werden.
- **5.3 Twelve Data Free Tier · harte Limits** · in 4.5 dokumentiert und gelöst.
- **5.4 CoinGecko-Rate-Limit** · bei intensiven Tests 429 möglich, defensive Logik greift sauber.

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.7)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Plan-First mehrfach bewährt:** Plan wurde in 4.5 (drei Runden), 4.5b, 4.5c, 4.6 (SVG-Geometrie), 4.7 (Macro-Recherche) iteriert bevor Code entstand
- **Slice-Aufteilung sichtbar/unsichtbar** (4.5b/4.5c)
- **Spec-Sync nach Abweichungen** (Beispiel post-4.5c)
- **Live-Daten-Verifikation:** API-Tests vor Code (4.5, 4.7), SVG-Pfad gegen realen Mondstand (4.6), Macro-Recherche über offizielle Quellen (4.7)
- **Bewusste Spec-Abweichung bei guter Begründung erlaubt** — z.B. MacroTimeline = Liste statt ECharts (Robustheit > Spec-Treue) · muss aber in Spec dokumentiert werden

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env + beide Vercel-Projekte
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Quirks: bei Gauges `title: { show: false }` explizit setzen (sonst doppeltes Label)

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · gesynct (14.5.2026) · §6 4.7 ✅ · letzter Spec-Sync für 4.8 angepeilt
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 31 (Slice 4.7)

---

## 7 · Erster Schritt in der neuen Session · Slice 4.8

1. claude.ai liest §7.8 und den Stand nach 4.7
2. Sieht durch was beim Volltest auf /wirtschaft + /wetter auffällt
3. Baut GO-Prompt für 4.8 · Polish-Tasks + Spec-Sync (§7.7-Realitäts-Notiz +
   §5-Komponenten-Liste + §3-Modul-Update) + Phase-4-Synthese im SESSION_LOG
4. Plan-First in Claude Code · die Reihenfolge der Polish-Items festlegen

**Empfehlung:** 4.8 ist der Abschluss-Slice. Sauber durchziehen, danach ist
Phase 4 ein abgeschlossenes Kapitel und das HQ-MVP steht.
