---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Nächster Phase-Start oder Mini-Reparatur-Slice
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.8

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

**Phase 4 · Charts + Trading-Watchlist — ABGESCHLOSSEN (14.5.2026)**

Phase-4-Slice-Status (alle ✅):
- Slice 4.1 ✅ ECharts-Foundation + BTC-Sparkline
- Slice 4.2 ✅ Trading-Indikatoren-Block (Production-Binance-Fallback bleibt offene Issue 5.1)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation
- Slice 4.4 ✅ Watchlist-UI-Komponenten + Mini-Sparklines
- Slice 4.5 ✅ Aktien + Forex-Sektion · Twelve-Data-Endpoint-Architektur
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard
- Slice 4.5c ✅ Daten-Architektur-Cleanup · kryptoAggregator
- Spec-Sync ✅ Phase-4-Spec an Realität angeglichen + Eyebrow
- Slice 4.6 ✅ Wetter-Wochen-Bars + Mondphase-SVG auf /wetter
- Slice 4.7 ✅ Macro-Timeline + Fear & Greed Gauge auf /wirtschaft
- Slice 4.8 ✅ Polish + Volltest + Phase-4-Abschluss + Doku

**Was produktionsreif ist:**

**/wirtschaft:** KryptoHero (Sparkline) · TradingIndikatoren (5 Cards, lokal live) ·
KryptoSektion (12 Assets in 2 Blöcken, AssetCard+Sparkline) · AktienSektion (6 US Tech,
AssetCard) · ForexCommoditiesSektion (4 Pairs Tabelle, Commodities ehrlich leer) ·
MacroTimeline (9 Events, Mario pflegt monatlich) · FearGreedGauge (live Alternative.me,
1h-Cache) · WirtschaftsNews · TradeSetupsPlaceholder.

**/wetter:** WetterDetail (live Open-Meteo) · WochenübersichtStrip · WetterWochenBars
(ECharts, 7-Tage Min/Max) · AstronomieSektion (Mondphase-SVG mathematisch korrekt) ·
FotoSpots.

**Volltest 14.5.2026:** Light / Dark / Mobile 375px auf beiden Pages — sauber.
Console 0 Errors.

---

## 3 · Bekannte Production-Issues (nicht blockierend)

- **5.1 · Vercel blockt Binance-API** — 4 Trading-Indikator-Cards zeigen FALLBACK.
  Lokal live. Geo/IP-Block. → Mini-Reparatur-Slice oder akzeptieren.
  Optionen: Edge-Function-Proxy, Bybit/OKX als Alternative.
- **5.2 · Vercel-Doppel-Projekt** — `mario-hq` (ohne Custom Domain) kann gefahrlos
  gelöscht werden. DNS-Check vor Löschung.

---

## 4 · Was als Nächstes kommen könnte

Mario entscheidet. Mögliche Richtungen:

**Option A · Mini-Reparatur-Slice (Production-Issues):**
- Vercel-Binance-Block diagnostizieren (Edge-Function-Proxy oder Bybit/OKX-Alternative)
- Vercel-Doppel-Projekt bereinigen

**Option B · Phase 6 · Briefing-Erweiterungen:**
- Trade-Setups konkret (Entry/SL/TP mit R:R) auf /wirtschaft
- On-Chain & Sentiment (Glassnode ab ~$39/Monat)
- Streaks-Tracker mit GitHub-Style Heatmap
- Eigene Domain einrichten (hq.dasdarugna.ch o.ä.)

**Option C · Foto-Inspiration Slice 4.6b:**
- Datenmodell für foto-spots.json (Mario muss Metadaten-Felder festlegen)
- Matching-Logik (Wetterlage + Tageszeit → passende Spots heute)
- Seiten-Umbenennung "Wetter" → "Wetter und Foto"
- Voraussetzung: Mario entscheidet welche Metadaten-Felder Sinn ergeben

**Option D · Phase 3 · Content-Pipeline (zurückgestellt):**
- Trigger: Habits/Notizen-Tracking oder Archiv-Wunsch

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–4.8)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Sichtbar vs. unsichtbar trennen** (4.5b/4.5c-Pattern)
- **Live-Daten-Verifikation vor Code** (API-Tests, SVG-Geometrie festnageln)
- **Spec-Abweichung erlaubt** bei guter Begründung — in Realitäts-Box dokumentieren
- **Build-Test vor Push** — Pflicht, auch bei Doc-Änderungen

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- ENV-Vars: lokal in .env + beide Vercel-Projekte
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev
- Vite-HMR-Cache-Bug nach `git mv`: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · ABGESCHLOSSEN (14.5.2026) · alle Slices ✅
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 32 (Phase-4-Synthese)

---

## 7 · Erster Schritt in der neuen Session

1. Mario entscheidet welche Richtung (Mini-Reparatur / Phase 6 / Foto-Inspiration / Phase 3)
2. claude.ai liest relevante Spec + Handover
3. Plan-First in Claude Code · Slice-Ziel + Umfang klären
4. Slice ausführen

**Phase 4 ist ein abgeschlossenes Kapitel. Das HQ-MVP steht.**
