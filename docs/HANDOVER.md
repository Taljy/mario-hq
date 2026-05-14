---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 5.3 begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Phase 5 Slice 5.2

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
- Slice 5.2 ✅ WetterCard live · Bau-Aufteilung 5.2a/5.2b
  - 5.2a ✅ `getStundenHeute()` in `astronomieResolver` (feat `8decc27`)
  - 5.2b ✅ WetterCard-Live-Swap + nauticalDusk-Korrektur (feat `a5ffb9e`)
- **Slice 5.3 ← NÄCHSTER SCHRITT** · Kalender + Macro + News + EventBanner
- Slice 5.4 · Polish + Cover-Stempel "Phase 5" + Phase-5-Abschluss

**Zur Slice-Nummerierung:** Phase 5 zählt 5.1, 5.2, 5.3, 5.4 (4-Slice-Zählung). 5.2 ist intern in 5.2a/5.2b geteilt (Bau-Aufteilung analog 4.5b/4.5c, keine neue Phasen-Nummer). Frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* war ein Phase-4-Nachläufer-Label · Commits per SHA referenziert.

### Cover-Stand

| Card | Status | Quelle |
|---|---|---|
| KryptoCard | ✅ live | CoinGecko + Alternative.me |
| WetterCard | ✅ live | Open-Meteo + SunCalc + FotoSpotPicker |
| KalenderCard | Stub | kalenderResolver (kommt in 5.3) |
| MacroCard | Stub | macroResolver (kommt in 5.3) |
| NewsCard | Stub | newsResolver (kommt in 5.3) |
| EventBanner | Stub | eventResolver (kommt in 5.3) |

**Production live auf `mario-hq-qc6f.vercel.app/`:** echte BTC-Preise + Wetter Baden AG + Goldene/Blaue Stunde + Foto-Hinweis. Macro/Kalender/News/EventBanner zeigen weiterhin Stub-Werte.

---

## 3 · Nächster Schritt · Slice 5.3 · Kalender + Macro + News + EventBanner

**Spec §4.3, §4.4, §4.5, §4.6.** Drei Cards + ein Banner in einem Slice. Alle Quellen battle-tested aus Phase 4 oder Mario-gepflegt — kleinere Einzel-Swaps.

**Tasks (in einer sinnvollen Reihenfolge):**

1. **KalenderCard live** · `getKalenderTermine()` aus `icalFetcher` (ENV-gestützt mit Fallback `kalender-fallback.json`, läuft seit Phase 2.3 stabil)
   - `tage[0]` = heute → Termine
   - `tage[1..7]` → kompakter Wochen-Strip-Text (Format des aktuellen Stub: `"Do Mail · Fr frei · Sa Glose · So Mami"` — daraus jetzt echte Daten ableiten oder Format neu denken)
   - Stub-Files löschen: `kalenderResolver.ts` + `kalender.json`

2. **MacroCard live** · `getMacroEvents()` aus `macroEventsResolver` (Phase 4.7, 9 echte Events 14.5.–28.5.)
   - Heutiges Event = `events.find(e => e.datum === heute)`
   - `tagesthema` = event.name, `zeit` = event.uhrzeit
   - **Indizes-Zeile entfällt** (Mario-Entscheidung Phase-5-Eröffnung · keine Indizes im Free Tier · statische Lüge vermeiden)
   - Stub-Files löschen: `macroResolver.ts` + `macro.json`

3. **NewsCard live** · neue Quelle: `cover_headlines: string[]`-Feld in `news-voll.json` (Mario-gepflegt, Single-Source-Entscheidung Phase-5-Eröffnung)
   - `getNewsHeute()` zieht aus `news-voll.cover_headlines`
   - **Initial-Befüllung von `cover_headlines`**: Mario kann die 3 bisherigen Headlines aus `news.json` (Schweizer AI-Act / Saharastaub / Tesla) übernehmen oder neu kuratieren
   - Stub-Files löschen: `news.json`

4. **EventBanner live** · von `eventResolver` (Stub) auf `macroEventsResolver` umstellen
   - **Trigger-Entscheidung vor Verdrahten** (Mario-Entscheidung Phase-5-Eröffnung):
     1. Zählen wie viele `impact === 'kritisch'`-Events in `macro-events.json` im aktuellen 14-Tage-Fenster liegen
     2. Wenn 1–2 → Trigger lockern auf `kritisch || hoch`
     3. Wenn 4–5 → `kritisch` allein
     4. Ergebnis (Zählung + gewählter Trigger) im Slice-5.3-Bericht festhalten
   - Stub-Files löschen: `eventResolver.ts` + `events.json`

**Umfang:** mittel · drei Cards + ein Banner · alle Quellen vorhanden · keine API-Risiken.

---

## 4 · Bekannte Production-Issues (nicht blockierend für 5.3)

- **US-Datacenter-IP-Block · Derivate-Börsen-Klasse** *(struktureller Befund, 14.5.)* — Binance + Bybit beide von Vercel-iad1-IPs geblockt. DeFiLlama, CoinGecko, Alternative.me, Coinbase, Open-Meteo, Twelve Data laufen normal. Verbleibender Lösungs-Pfad: Architektur (Fetch-und-ablegen) **GEPARKT** mit Trigger "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live". Cheap-Schritt-1: GH-Actions-Runner-IP-Test gegen Bybit/Binance.
- **WetterCard Mobile 375px (5.2b-Befund)** · `card-head` wrappt Eyebrow + Live-Stempel je auf zwei Zeilen — funktional ok, optisch eng. Slice 5.4 ist der Ort für ggf. Anpassung.

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.2)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan-First-Befund offen festhalten** wenn die GO-Annahme von der Realität abweicht — wie in 5.2a/5.2b
- **Sanity-Checks gegen unabhängige Quellen** — nicht zirkulär. SunCalc-Werte werden gegen `api.sunrise-sunset.org` validiert
- **Bau-Aufteilung innerhalb eines Slices** (4.5b/4.5c-Pattern · 5.2a/5.2b-Pattern) — bleibt EIN Slice in der Phasen-Zählung
- **Daten-/View-Logik-Trennung** · Resolver liefern Werte, Cards formatieren (z.B. Stunden-Em-Dash in WetterCard, Schweizer-Apostroph in KryptoCard)
- **UI-Wahrheit** — Eyebrows + Quellen-Labels stimmen mit dem aktuellen Fetcher-Code überein
- **Build-Test vor Push** — Pflicht, auch bei reinem docs-Commit

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- TypeScript strict · keine any
- prerender = false auf api/-Routes und `/` (seit 5.1)
- Vercel-Edge-Cache greift NICHT in `npm run dev`
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen
- Lokale Erreichbarkeit ≠ Vercel-Erreichbarkeit (Phase-4-Nachläufer-Lehre)
- **Production-curl-Stolperstein (verschärft in 5.2b):** Nanosekunden-Bust (`$(date +%s%N)`) hilft gegen Edge-Cache, aber **auch zwischen `until curl -sf` und Inhalts-curl** kann der CDN noch alte Werte serve-en. Status-200 ≠ Inhalts-Propagation. Mehrfach curl-en oder kurz warten.
- Node-Skripte ausserhalb des Projekt-Roots können Projekt-Dependencies nicht resolven — Test-Skripte im Projekt-Root ablegen (z.B. `_test-xyz.mjs`, danach löschen)
- Custom Domain steht weiter aus (Phase 6) — keines der früheren Vercel-Projekte hatte je eine

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-5-COVER-SYNC-SPEC.md` · in Arbeit · §2-Status: 5.1 + 5.2 ✅
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · abgeschlossen
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Layout-Pattern-Vorbild (frozen)
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen
- `_pendenzen.md` · Roadmap · Phase 5 aktiv · Slice 5.2 ✅
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 36 (Slice 5.2b)

---

## 7 · Erster Schritt in der neuen Session · Slice 5.3

1. claude.ai liest §4.3, §4.4, §4.5, §4.6 der Phase-5-Spec
2. Sieht durch: vier Swaps, alle aus battle-tested Quellen · EventBanner-Trigger-Zählung als Plan-Schritt vor Verdrahten
3. Baut GO-Prompt für 5.3 mit Plan-First-Bestätigung · besonders: Wochen-Strip-Format Kalender (heutiger Stub-Format vs. echtes Format) + News `cover_headlines` Initial-Befüllung + EventBanner-Trigger nach Zählung
4. In Claude Code: Plan-First mit konkretem Bau-Schritt-Plan, dann bauen
