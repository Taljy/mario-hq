---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.6 begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Spec-Sync (post-4.5c)

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.
> Ausführliche Historie in `_pendenzen.md`, `_projekt.md`, `SESSION_LOG.md` und
> den Spec-Files im Repo.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app (kanonisch · siehe Doppel-Projekt-Issue)
- **Vision:** persönliches Cockpit · möglicher Open-Source-Boilerplate-Wert

Mario ist Architekturfotograf (Studio Da Rugna), Swing-Trader, Schweizer
Hochdeutsch, du-Form. Pragmatischer Maximalismus.

---

## 2 · Wo wir gerade stehen

**Phase 4** (Charts + Trading-Watchlist) · IN ARBEIT

Phase-4-Slice-Status:
- Slice 4.1 ✅ ECharts-Foundation + DRG-Theme + BTC-Sparkline
- Slice 4.2 ✅ Trading-Indikatoren-Block (lokal komplett · Production Binance-Fallback, siehe Issue)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation + Cleanup
- Slice 4.4 ✅ Watchlist-UI-Komponenten + Mini-Sparklines + Preis-Format-Fix
- Slice 4.5 ✅ Aktien + Forex-Sektion · Twelve-Data-Endpoint-Architektur
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard (Zwischen-Slice, kein Spec-Slice)
- Slice 4.5c ✅ Daten-Architektur-Cleanup · kryptoAggregator (Zwischen-Slice, kein Spec-Slice)
- Spec-Sync ✅ Phase-4-Spec an Realität nach 4.5b/c angeglichen + Eyebrow "KRYPTO · MÄRKTE"
- **Slice 4.6 ← NÄCHSTER SCHRITT** · Wetter-Wochen-Bars + Mondphase-SVG auf /wetter (Spec §7.6)
- Slice 4.7 Macro-Timeline + Fear & Greed Gauge (Spec §7.7)
- Slice 4.8 Polish + Volltest + Phase-Abschluss (Spec §7.8)

Commits Spec-Sync: feat `197930c` (Eyebrow) · docs ausstehend (mit diesem Handover-Push)

**Phase 4 ist intern jetzt konsistent:** Spec und Code beschreiben dasselbe. /wirtschaft
ist abgeschlossen — KryptoSektion (zwei Blöcke, Card-Grid via AssetCard, collapsible),
AktienSektion (6 US-Tech-Cards via AssetCard), ForexCommoditiesSektion (Tabelle + Leer-Hinweis
für Commodities). Twelve-Data-Endpoint-Architektur etabliert.

---

## 3 · Nächster Schritt · Slice 4.6 · Wetter-Wochen-Bars + Mondphase-SVG

**Spec §7.6.** Erste Phase-4-Arbeit auf /wetter (nicht /wirtschaft).

**Files (laut Spec):**
- `src/components/wetter/WetterWochenBars.astro` · ECharts horizontale Bars
  (Min/Max-Temperatur über 7 Tage)
- `src/components/wetter/MondphaseSvg.astro` · Custom-SVG (Mondphase-Kreis
  mit Schatten-Halbkreis je nach Beleuchtungs-Prozent)

**Datenbasis (bereits vorhanden):**
- Wetter-Wochen-Daten aus `wetter.woche` (Open-Meteo-Fetcher seit Phase 2.3)
- Mondphase-Daten aus `astronomieResolver.ts` (SunCalc-basiert, seit Phase 2.3)

**Integration:**
- WetterWochenBars unter WetterDetail auf /wetter einbinden
- MondphaseSvg in AstronomieSektion auf /wetter

**Design-Linie:**
- WetterWochenBars: ECharts mit DRG-Theme (zwingend), Höhe ~120px, keine Tooltips
- MondphaseSvg: Stroke `var(--fg)` 1.5px, Schatten `var(--bg-card)`, ~60×60px, sumi-e-Reduktion
- DRG-Tokens strikt, keine Spring/Bounce

**Geschätzter Umfang:** mittel · ähnlich grosser Slice wie 4.1 (ECharts-Foundation
bereits gelegt, hier "nur" eine zweite ECharts-Anwendung + eine Custom-SVG-Komponente).

**Keine API-Limits-Sorgen:** Open-Meteo + SunCalc · keine Calls gegen Twelve Data oder CoinGecko.

---

## 4 · Kleinaufgaben (einschiebbar)

- **Cover-Phasen-Stempel** · "MARIO'S HQ · V0.1 · PHASE 2.2" — separates Layout-
  Meta-Element auf der Cover (nicht der globale Footer). Trivialer Mini-Hygiene-Fix.

---

## 5 · Bekannte Production-Issues (nicht blockierend für 4.6)

### 5.1 · Vercel blockt Binance-API
4 Trading-Indikator-Cards zeigen "FALLBACK · BINANCE OFFLINE" auf Production.
Lokal funktioniert. Geo-/IP-Block. → **Mini-Reparatur-Slice.**

### 5.2 · Vercel-Doppel-Projekt
`mario-hq` (ohne Custom Domain) kann gefahrlos gelöscht werden, `qc6f` ist
kanonisch. → **Mini-Hygiene-Slice.**

### 5.3 · Twelve Data Free Tier · harte Limits
Spec §7.5 dokumentiert das. Endpoint-Architektur löst es im Steady-State, Cold-
Start nach Deploy zeigt einmal Forex offline (akzeptiert).

### 5.4 · CoinGecko-Rate-Limit
Bei intensiven API-Tests kann CoinGecko temporär 429 zurückgeben → Krypto-Cards
zeigen "—". Defensive Logik im kryptoAggregator greift sauber. Limit resettet
pro Minute.

---

## 6 · Mini-Slices die zwischendrin eingeschoben werden können

- **Mini-Reparatur · Vercel-Binance-Block**
- **Mini-Hygiene · Vercel-Doppel-Projekt löschen**
- **Mini-Hygiene · Cover-Phasen-Stempel "PHASE 2.2" → "Phase 4"**

---

## 7 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.5c + Spec-Sync)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Slice-Aufteilung sichtbar/unsichtbar:** Bewährt in 4.5b/4.5c — sichtbarer
  Rebuild zuerst, dann interner Refactor.
- **Spec-Sync nach Abweichungen:** Bewährt — wenn Realität von Spec divergiert,
  korrigieren statt überschreiben. Entscheidungs-Historie ist wertvoll
  (zeigt was geprüft + verworfen wurde).
- **Plan-First mehrfach bewährt:** API-Test vor Code in 4.5, Promise-Pfad-
  Prüfung vor Direct-Await in 4.5c.
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env (gitignored) + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev — Cache-Verifikation auf Production
- Claude-Code-Preview-Browser kann nur localhost öffnen, keine Vercel-URLs —
  Production-Verifikation via curl/HTTP-Checks
- CoinGecko-Rate-Limit · Bulk-Call für alle Coin-IDs, nicht einzeln
- Vite-HMR-Cache-Bug nach `git mv`: Dev-Server neu starten

---

## 8 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · **frisch gesynct (14.5.2026)** ·
  §6 Slice-Tabelle, §4.1 Schema, §5 Komponenten-Liste, §7.3-§7.5 mit Realitäts-
  Boxen + Original-Text erhalten · §9 Fragen 1-4 als beantwortet markiert ·
  §11 Stolpersteine um 17-21 erweitert
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 29 (Spec-Sync)

---

## 9 · Erster Schritt in der neuen Session · Slice 4.6

1. claude.ai liest `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §7.6 und
   prüft die /wetter-Datenquellen (Open-Meteo-Fetcher, SunCalc/astronomieResolver)
2. Baut GO-Prompt für 4.6 · zwei Komponenten · ECharts + Custom-SVG · Integration
   auf /wetter (Reihenfolge auf der Page klären)
3. Plan-First in Claude Code · ECharts-Pattern-Klon von Sparkline.astro
4. Sektions-Reihenfolge auf /wetter klären (in welche Sektion gehört Mondphase
   — eigene Astronomie-Sektion oder neben Wetter?)
