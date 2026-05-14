---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.7 begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.6

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

Mario ist Architekturfotograf (Studio Da Rugna), Swing-Trader, Schweizer
Hochdeutsch, du-Form. Pragmatischer Maximalismus.

---

## 2 · Wo wir gerade stehen

**Phase 4** (Charts + Trading-Watchlist) · IN ARBEIT

Phase-4-Slice-Status:
- Slice 4.1 ✅ ECharts-Foundation + DRG-Theme + BTC-Sparkline
- Slice 4.2 ✅ Trading-Indikatoren-Block (lokal komplett · Production Binance-Fallback)
- Slice 4.3 ✅ Multi-Anbieter-Watchlist-Foundation
- Slice 4.4 ✅ Watchlist-UI-Komponenten + Mini-Sparklines
- Slice 4.5 ✅ Aktien + Forex-Sektion · Twelve-Data-Endpoint-Architektur
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard (Zwischen-Slice)
- Slice 4.5c ✅ Daten-Architektur-Cleanup · kryptoAggregator (Zwischen-Slice)
- Spec-Sync ✅ Phase-4-Spec an Realität angeglichen + Eyebrow
- Slice 4.6 ✅ Wetter-Wochen-Bars + Mondphase-SVG auf /wetter
- **Slice 4.7 ← NÄCHSTER SCHRITT** · Macro-Timeline + Fear & Greed Gauge auf /wirtschaft (Spec §7.7)
- Slice 4.8 Polish + Volltest + Phase-Abschluss (Spec §7.8)

Commits Slice 4.6: feat `f831209` · docs ausstehend (mit diesem Handover-Push)

**/wirtschaft + /wetter sind beide auf Phase-4-Stand:** /wirtschaft mit KryptoSektion
(zwei Blöcke + AssetCard), AktienSektion, ForexCommoditiesSektion, TradingIndikatoren.
/wetter mit WetterDetail, WetterWochenBars (ECharts), AstronomieSektion (mit Mondphase-SVG),
FotoSpots.

---

## 3 · Nächster Schritt · Slice 4.7 · Macro-Timeline + Fear & Greed Gauge

**Spec §7.7.** Zwei weitere Editorial-Charts auf /wirtschaft.

**Files (laut Spec):**
- `src/components/wirtschaft/MacroTimeline.astro` · ECharts horizontale Timeline
  mit farbcodierten Events für die nächsten 14 Tage
- `src/components/wirtschaft/FearGreedGauge.astro` · ECharts Gauge-Chart
  (Halbkreis-Tachometer, 0-100)
- `src/lib/fearGreedFetcher.ts` · neuer Fetcher für `api.alternative.me/fng/?limit=1`
- `src/data/macro-events.json` · NEU oder schon vorhanden? prüfen (Spec §4.2
  beschreibt das Schema)

**Macro-Timeline:**
- Daten aus `macro-events.json` (manuell gepflegt von Mario)
- Schema laut Spec §4.2: `{ datum, name, kategorie, impact, uhrzeit }` für jedes Event
- Farb-Codierung nach Impact: kritisch=Vermillon, hoch=Tinte-Mittel, mittel=Tinte-Hell
- Mario aktualisiert das JSON manuell ~monatlich — kein API-Call

**Fear & Greed Gauge:**
- API: `https://api.alternative.me/fng/?limit=1` (gratis, kein Key)
- Liefert Wert 0-100 + Label ("Extreme Fear" … "Extreme Greed")
- Halbkreis-Tachometer mit Nadel
- Farbverlauf: Vermillon (Extreme Fear) → neutral (Mitte → Greed) · **KEIN Grün** (DRG-Linie)
- Wert in Fraunces gross in der Mitte, Label in Mono darunter
- Caching: 1h (Wert ändert sich langsam)

**Geschätzter Umfang:** mittel · zwei ECharts-Komponenten, dritter Fetcher mit
Cache. Foundation aus 4.1/4.6 ist da, Pattern-Klon möglich.

**Keine API-Limit-Sorgen:** alternative.me Fear & Greed hat keine harten Limits,
macro-events.json ist statisch.

---

## 4 · Kleinaufgaben (einschiebbar)

- **Cover-Phasen-Stempel** · "MARIO'S HQ · V0.1 · PHASE 2.2" — separates
  Layout-Meta-Element auf der Cover. Trivialer Fix.

---

## 5 · Bekannte Production-Issues (nicht blockierend für 4.7)

### 5.1 · Vercel blockt Binance-API
4 Trading-Indikator-Cards zeigen Fallback. Lokal funktioniert. → Mini-Reparatur-Slice.

### 5.2 · Vercel-Doppel-Projekt
`mario-hq` (ohne Custom Domain) kann gefahrlos gelöscht werden.

### 5.3 · Twelve Data Free Tier · harte Limits
Spec §7.5 dokumentiert. Endpoint-Architektur löst es im Steady-State.

### 5.4 · CoinGecko-Rate-Limit
Bei intensiven API-Tests kann CoinGecko 429 zurückgeben. Defensive Logik greift sauber.

---

## 6 · Mini-Slices die zwischendrin eingeschoben werden können

- **Mini-Reparatur · Vercel-Binance-Block**
- **Mini-Hygiene · Vercel-Doppel-Projekt löschen**
- **Mini-Hygiene · Cover-Phasen-Stempel "PHASE 2.2" → "Phase 4"**

---

## 7 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.6)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Plan-First mehrfach bewährt:** API-Test vor Code (4.5), Promise-Pfad-Prüfung
  vor Direct-Await (4.5c), SVG-Geometrie-Festnagelung vor Komponenten-Bau (4.6).
- **Slice-Aufteilung sichtbar/unsichtbar:** Bewährt in 4.5b/4.5c.
- **Spec-Sync nach Abweichungen:** Bewährt.
- **Live-Daten-Verifikation vor visuellem Trust:** In 4.6 hat der SunCalc-Live-Test
  + SVG-Pfad-Inspektion + synthetische Tests aller Mondphasen sichergestellt, dass
  die Geometrie mathematisch stimmt — nicht "sieht ok aus".
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev
- Claude-Code-Preview-Browser kann nur localhost öffnen, keine Vercel-URLs
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible nicht vergessen
- ECharts-Theme zentral registrieren (`ensureThemeRegistered()`-Singleton)

---

## 8 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · gesynct (14.5.2026) · §6 4.6 ✅
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 30 (Slice 4.6)

---

## 9 · Erster Schritt in der neuen Session · Slice 4.7

1. claude.ai liest `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §7.7 und §4.2
   (macro-events.json-Schema) — prüft, ob die JSON-Datei schon existiert oder
   erst angelegt werden muss
2. Test-Call gegen `https://api.alternative.me/fng/?limit=1` (kostenlos, kein Key)
   als ersten Teilschritt — reales Response-Schema verifizieren bevor Fetcher gebaut
3. Baut GO-Prompt für 4.7 · zwei ECharts-Komponenten (Timeline + Gauge) +
   Fetcher + macro-events.json + Integration auf /wirtschaft
4. Plan-First in Claude Code · Pattern-Klon von WetterWochenBars für Timeline,
   ECharts-Gauge ist neuer Chart-Typ (Doku lesen)
