---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 5.2b begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Phase 5 Slice 5.2a

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app (einziges Vercel-Projekt seit 14.5.)

Mario: Architekturfotograf, Swing-Trader, Schweizer Hochdeutsch, du-Form.

---

## 2 · Wo wir gerade stehen

**Phase 4** · Charts + Trading-Watchlist — ABGESCHLOSSEN (14.5.2026).

**Phase-4-Nachläufer-Slice** · Binance/Bybit-Swap — eskaliert (Commits `91ef169` + `7de6592`). Schnell-Fix-Pfad erschöpft. Architektur-Frage geparkt mit Trigger.

**Phase 5 · Cover-Sync — in Arbeit (14.5.2026).**

Phase-5-Status:
- Slice 5.1 ✅ SSR-Foundation + KryptoCard live (feat `7af3bf9`)
- **Slice 5.2 · in Bau-Aufteilung 5.2a/5.2b** (analog 4.5b/4.5c-Pattern · bleibt EIN Slice in der 4er-Phasen-Zählung)
  - **5.2a ✅** `getStundenHeute()` in `astronomieResolver` (feat `8decc27`)
  - **5.2b ← NÄCHSTER SCHRITT** · WetterCard-Live-Swap mit WetterSymbol-Wrapper + getWetterErgebnis + getStundenHeute + getFotoEmpfehlung + Stub-Files löschen
- Slice 5.3 · Kalender + Macro + News + EventBanner
- Slice 5.4 · Polish + Cover-Stempel "Phase 5" + Phase-5-Abschluss

**Zur Slice-Nummerierung:** Die frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* war ein Phase-4-Nachläufer-Label. Phase 5 zählt 5.1, 5.2, 5.3, 5.4 (4-Slice-Zählung). 5.2 ist intern in 5.2a/5.2b geteilt (Bau-Aufteilung).

### Cover-Stand

| Card | Status | Quelle |
|---|---|---|
| KryptoCard | ✅ live | CoinGecko + Alternative.me |
| WetterCard | Stub | wetterPicker (wird in 5.2b live) |
| KalenderCard | Stub | kalenderResolver (kommt in 5.3) |
| MacroCard | Stub | macroResolver (kommt in 5.3) |
| NewsCard | Stub | newsResolver (kommt in 5.3) |
| EventBanner | Stub | eventResolver (kommt in 5.3) |

**Production live:** `mario-hq-qc6f.vercel.app/` zeigt KryptoCard mit echten BTC-Preisen + Fear & Greed.

---

## 3 · Nächster Schritt · Slice 5.2b · WetterCard live

**Spec §4.2.** Erbt die 5.2a-Foundation und macht den eigentlichen Card-Swap.

**Tasks:**
- `src/pages/index.astro` Promise.all erweitern: `+ getWetterErgebnis() + getAstronomieHeute()` (oder direkt `getStundenHeute()` und `getFotoEmpfehlung()`); WetterCard bekommt entsprechende Props
- `src/components/WetterCard.astro` Live-Swap:
  - Wechsel von `getWetterHeute()`-Stub auf Props-Interface
  - **WetterSymbol-Wrapper direkt nutzen:** `<WetterSymbol wmoCode={wetter.heute.wmo_code} size={64} />` aus `src/components/wetter-symbole/` — ersetzt das aktuell inline-duplizierte `SonneWolken`-SVG
  - Goldene + Blaue Stunde aus `getStundenHeute()` (5.2a-Foundation)
  - `foto_hinweis` aus `getFotoEmpfehlung(wetter.heute).begruendung`
  - Live-Stempel-Pattern wie KryptoCard (5.1)
- `src/lib/wetterPicker.ts` + `src/data/wetter.json` löschen

**Risiken:**
- WetterSymbol-Wrapper `size`-Prop: aktuelle Cover-Card hat 64×64px → `size={64}` passt
- Format Goldene/Blaue Stunde-Range: Cover zeigt aktuell `"20:00 — 20:48"` (Em-Dash, kein Bindestrich). Aus `StundenHeute.{start, ende}` zusammensetzen
- Mario kann die Blaue-Stunde-Definition (heute `sunset` → `dusk`) in 5.2b oder später anpassen wenn sie auf der echten Card visuell unpassend ist · Alternative wäre bis `nauticalDusk`
- Production-Check nach Push: WetterCard-Werte aus Open-Meteo, Goldene/Blaue Stunde aus SunCalc (lokal, kein API-Risiko)

**Geschätzter Umfang:** klein-mittel · der Foundation-Baustein steht bereits aus 5.2a.

---

## 4 · Bekannte Production-Issues (nicht blockierend für 5.2b)

- **US-Datacenter-IP-Block · Derivate-Börsen-Klasse** *(struktureller Befund, 14.5.)* — Binance + Bybit beide von Vercel-iad1-IPs geblockt. DeFiLlama, CoinGecko, Alternative.me, Coinbase, Open-Meteo, Twelve Data laufen normal. Verbleibender Lösungs-Pfad: Architektur (Fetch-und-ablegen) **GEPARKT** mit Trigger "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live". Cheap-Schritt-1: GH-Actions-Runner-IP-Test gegen Bybit/Binance.
- Auf /wirtschaft: 4 Trading-Indikator-Cards Fallback (UI-Wahrheit korrekt: "Fallback · Bybit offline").

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.2a)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan-First-Befund offen festhalten** wenn die GO-Annahme von der Realität abweicht — wie in 5.2a wo "Refactor-Schuld aus 2.3.3" nicht existierte. Keine tote Helper-Datei bauen, deren Begründung sich später als Luftnummer zeigt
- **Sanity-Checks gegen unabhängige Quellen** — nicht zirkulär. 5.2a-Beispiel: SunCalc gegen `api.sunrise-sunset.org` validiert, nicht gegen die eigene Annahme
- **Bau-Aufteilung innerhalb eines Slices** (4.5b/4.5c-Pattern · 5.2a/5.2b-Pattern) — bleibt EIN Slice in der Phasen-Zählung
- **UI-Wahrheit** — Eyebrows + Quellen-Labels stimmen mit dem aktuellen Fetcher-Code überein
- **Build-Test vor Push** — Pflicht, auch bei reinem docs-Commit

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- TypeScript strict · keine any
- prerender = false auf api/-Routes und ab 5.1 auch auf `/`
- Vercel-Edge-Cache greift NICHT in `npm run dev`
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen
- Lokale Erreichbarkeit ≠ Vercel-Erreichbarkeit (Phase-4-Nachläufer-Lehre)
- Production-curl: Nanosekunden-Bust (`$(date +%s%N)`) oder Edge-Cache des alten Deploys riskiert Verwirrung
- Node-Skripte ausserhalb des Projekt-Roots können Projekt-Dependencies nicht resolven — Test-Skripte im Projekt-Root ablegen (z.B. `_test-xyz.mjs`, danach löschen)
- Custom Domain steht weiter aus (Phase 6) — keines der früheren Vercel-Projekte hatte je eine

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-5-COVER-SYNC-SPEC.md` · in Arbeit · §2 Status + §4.2 Realitäts-Box (nach 5.2a)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · abgeschlossen
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Layout-Pattern-Vorbild (frozen)
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen
- `_pendenzen.md` · Roadmap · Phase 5 als aktive Phase · 5.2a ✅
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 35 (Slice 5.2a)

---

## 7 · Erster Schritt in der neuen Session · Slice 5.2b

1. claude.ai liest §4.2 der Phase-5-Spec (inkl. Realitäts-Box aus 5.2a)
2. Sieht durch: WetterCard-Swap nutzt **direkt** den `<WetterSymbol>`-Wrapper · kein wmoSymbol-Helper · `getStundenHeute()` aus 5.2a-Foundation
3. Baut GO-Prompt für 5.2b mit Plan-First-Bestätigung
4. In Claude Code: Plan-First mit konkretem Mapping welche Props die WetterCard kriegt + wie das Foto-Hinweis-Feld gefüllt wird

**Empfehlung:** 5.2b ist der Card-Swap-Slice — kleiner als 5.2a-Original-Plan war, weil die Foundation steht. Production-Check nach Push: Open-Meteo läuft seit Phase 2.3 stabil auf Production, kein neuer API-Risiko-Faktor.
