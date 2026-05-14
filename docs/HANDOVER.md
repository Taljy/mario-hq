---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 5.2 begonnen oder abgeschlossen
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Phase 5 Slice 5.1

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app (kanonisch · einziges Vercel-Projekt seit 14.5.)

Mario: Architekturfotograf, Swing-Trader, Schweizer Hochdeutsch, du-Form.

---

## 2 · Wo wir gerade stehen

**Phase 4 · Charts + Trading-Watchlist — ABGESCHLOSSEN (14.5.2026).**

**Phase-4-Nachläufer-Slice · Binance/Bybit-Swap — eskaliert (14.5.2026, Commits `91ef169` + `7de6592`).** Schnell-Fix-Pfad für Vercel-Derivate-Börsen-IP-Block erschöpft. Bybit-Code bleibt auf main. Architektur-Frage geparkt mit Trigger.

**Phase 5 · Cover-Sync — in Arbeit (14.5.2026).**

Phase-5-Status:
- **Slice 5.1 ✅ Spec + SSR-Foundation + KryptoCard live** (feat `7af3bf9` · docs ausstehend mit diesem HANDOVER-Push)
- Slice 5.2 ← **NÄCHSTER SCHRITT** · Wetter-Card live (wmoSymbol-Helper + Goldene/Blaue Stunde via SunCalc)
- Slice 5.3 · Kalender + Macro + News + EventBanner
- Slice 5.4 · Polish + Cover-Stempel "Phase 5" + Phase-5-Abschluss

**Wichtig zur Slice-Nummerierung:** Die frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* (Commits `91ef169` + `7de6592`) war ein Übergangs-Label am Ende von Phase 4. Phase 5 (Cover-Sync) startet die Slice-Zählung neu mit 5.1, 5.2, 5.3, 5.4. Commits referenzieren wir weiterhin per SHA, nicht per Slice-Nummer.

### Cover-Stand nach Slice 5.1

| Card | Status | Quelle |
|---|---|---|
| KryptoCard | ✅ live | CoinGecko (BTC-Preis + 24h-Delta) · Alternative.me (Fear & Greed) |
| WetterCard | Stub | wetterPicker → wetter.json (kommt in 5.2) |
| KalenderCard | Stub | kalenderResolver → kalender.json (kommt in 5.3) |
| MacroCard | Stub | macroResolver → macro.json (kommt in 5.3) |
| NewsCard | Stub | newsResolver → news.json (kommt in 5.3) |
| EventBanner | Stub | eventResolver → events.json (kommt in 5.3, sauberer Übergang) |

**Production live:** `mario-hq-qc6f.vercel.app/` zeigt KryptoCard mit echten BTC-Preisen + Fear & Greed.

---

## 3 · Nächster Schritt · Slice 5.2 · Wetter-Card live

**Spec §4.2 + §5.2.** Mittlerer Slice mit drei Sub-Schritten:

**Sub-Schritt 1 · `wmoSymbol.ts`-Helper neu**
- Zentrales Mapping `wmo_code → SVG-Symbol-ID + inline-SVG-Renderer`
- Cover-WetterCard + Detail-WetterDetail beide darauf umstellen
- Bewusste Refactor-Schuld bezahlen (einzige erlaubte Nicht-Cover-Änderung in Phase 5)

**Sub-Schritt 2 · `astronomieResolver.getStundenHeute()` neu**
- Goldene Stunde + Blaue Stunde via `SunCalc.getTimes()` (lokale Berechnung, keine API)
- Format: `"20:00 — 20:48"` (passend zum bestehenden Card-Format)

**Sub-Schritt 3 · `WetterCard.astro` Live-Swap**
- Quellen: `getWetterErgebnis()` + `getStundenHeute()` + `getFotoEmpfehlung(wetter.heute)`
- `foto_hinweis` aus `FotoEmpfehlung.begruendung`
- `wetterPicker.ts` + `wetter.json` löschen

**Geschätzter Umfang:** mittel · drei Sub-Schritte mit klarer Reihenfolge. Notfalls in 5.2a/5.2b teilbar, aber lieber als ein Slice mit Plan-First-Aufstellung.

---

## 4 · Bekannte Production-Issues (alle nicht blockierend für 5.2)

- **US-Datacenter-IP-Block · Derivate-Börsen-Klasse** *(struktureller Befund, 14.5.)* — Binance + Bybit beide von Vercel-iad1-IPs geblockt. DeFiLlama, CoinGecko, Alternative.me, Coinbase, Open-Meteo, Twelve Data laufen normal. Verbleibender Lösungs-Pfad: nur noch Architektur (Fetch-und-ablegen), **GEPARKT** mit Trigger "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live". Cheap-Schritt-1 vor Pipeline-Bau: GH-Actions-Runner-IP-Test gegen Bybit/Binance.
- Auf /wirtschaft zeigen 4 Trading-Indikator-Cards "Fallback · Bybit offline" (UI-Wahrheit korrekt, funktional aus).

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.1)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan mit explizit benannten Risiken** — bekannte Wetten mit bekannten Niederlage-Möglichkeiten
- **Live-API-Test vor Code** · für Cover-Sync wo möglich Detail-Page-Fetcher wiederverwenden statt Parallel-Implementierung
- **UI-Wahrheit** — Eyebrows + Quellen-Labels stimmen mit dem aktuellen Fetcher-Code überein
- **Sichtbare vs unsichtbare Änderungen trennen** (4.5b/4.5c-Pattern)
- **Build-Test vor Push** — Pflicht, auch bei reinem docs-Commit

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- ENV-Vars: in Vercel Dashboard (nur noch ein Projekt seit 14.5.)
- TypeScript strict · keine any
- prerender = false auf api/-Routes und ab 5.1 auch auf `/`
- Vercel-Edge-Cache greift NICHT in `npm run dev`
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen
- Lokale Erreichbarkeit ≠ Vercel-Erreichbarkeit (Phase-4-Nachläufer-Lehre)
- **NEU (5.1):** Bei Production-Tests via curl: Nanosekunden-Bust (`$(date +%s%N)`) oder mehrfach reloaden — Sekunden-Bust trifft Vercel-Edge-Cache des alten Deploys
- **Custom Domain klargestellt:** keines der früheren Vercel-Projekte hatte je eine; Custom Domain steht weiter aus (Phase 6)

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-5-COVER-SYNC-SPEC.md` · in Arbeit · §2-Status nach jedem Slice aktualisieren
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · abgeschlossen
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Layout-Pattern-Vorbild (frozen)
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen
- `_pendenzen.md` · Roadmap · Phase 5 als aktive Phase
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 34 (Slice 5.1)

---

## 7 · Erster Schritt in der neuen Session · Slice 5.2

1. claude.ai liest §4.2 + §5.2 der Phase-5-Spec
2. Sieht durch was beim WetterCard-Swap zu beachten ist (Symbol-Mapping ist visuell, /wetter wird mit umgestellt)
3. Baut GO-Prompt für 5.2 mit Plan-First-Bestätigungsschritt vor Phase 2
4. In Claude Code: Plan-First mit Sub-Schritt-Reihenfolge nageln

**Empfehlung:** Slice 5.2 ist der grösste in Phase 5 (drei Sub-Schritte, plus Refactor-Touch auf /wetter). Plan-First sauber, dann die Sub-Schritte streng der Reihe nach (Symbol-Helper → Stunden-Resolver → Card-Swap). Volltest auf /wetter nach Sub-Schritt 1 nicht vergessen.
