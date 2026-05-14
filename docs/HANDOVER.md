---
typ: handover
projekt: mario-hq
erstellt: 26-05-15
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Mario entscheidet die nächste Richtung
---

# Handover · Mario's HQ · Stand 15.5.2026 · nach Phase 5

> **Für die neue claude.ai-Session:** Dieses Dokument als ersten Input geben.

---

## 1 · Was ist Mario's HQ

Editorial-Magazin als persönliches Cockpit. Astro v6 · TypeScript strict ·
Tailwind v4 · ECharts v6. DRG-Design-System (Fraunces / Inter / JetBrains Mono ·
Vermillon-Akzent ≤ 3 % · Sumi/Washi/Papier-Palette).

- **Repo:** github.com/Taljy/mario-hq (public)
- **Lokal:** ~/Developer/mario-hq
- **Production:** mario-hq-qc6f.vercel.app

Mario: Architekturfotograf, Swing-Trader, Schweizer Hochdeutsch, du-Form.

---

## 2 · Wo wir gerade stehen

**Phase 4 · Charts + Trading-Watchlist auf /wirtschaft — ABGESCHLOSSEN (14.5.2026).**

**Phase-4-Nachläufer-Slice · Binance/Bybit-Swap — eskaliert (14.5., Commits `91ef169` + `7de6592`).** Schnell-Fix-Pfad gegen Vercel-IP-Block erschöpft.

**Phase 5 · Cover-Sync — ABGESCHLOSSEN (15.5.2026).** Alle 5 Cover-Cards live auf Production.

**Das HQ-MVP steht funktional auf allen Pages.** Cover (/), /wirtschaft, /wetter, /kalender und /news rendern alle live oder mit Mario-gepflegten Daten.

### Was produktionsreif ist

**Cover (`/`):**
- KryptoCard · CoinGecko BTC-Preis + Fear & Greed (Alternative.me)
- WetterCard · Open-Meteo Heute + SunCalc Goldene/Blaue Stunde (nauticalDusk · ≈ 82 min) + FotoSpotPicker-Hinweis
- KalenderCard · Google iCal Read-Only (defensive Wochen-Strip-Generierung)
- MacroCard · macroEventsResolver 3er-Vorausschau (kritisch || hoch · kein Live-Stempel · keine Pulse)
- NewsCard · news-voll.cover_headlines (Mario-gepflegt, Single-Source mit /news)
- EventBanner stillgelegt (Datei bleibt mit Wiederanschluss-Anleitung im Header)

**`/wirtschaft`:** KryptoHero (Sparkline) · TradingIndikatoren (4 Cards Production-Fallback wegen IP-Block) · KryptoSektion (12 Coins) · AktienSektion (6 US-Tech) · ForexCommoditiesSektion · MacroTimeline (9 Events) · FearGreedGauge · WirtschaftsNews · TradeSetupsPlaceholder.

**`/wetter`:** WetterDetail · WetterWochenBars (ECharts) · AstronomieSektion (Mondphase-SVG) · FotoSpots.

**`/kalender`:** iCal Read-Only Google Calendar.

**`/news`:** 4 Kategorien × N Items (statisch, Mario-gepflegt).

---

## 3 · Offene Themen (kein Slice-Framing — Mario entscheidet Richtung)

Phase 5 hinterlässt vier offene Themen. KEINES davon ist als "nächster Slice" festgelegt — die nächste Richtung entscheidet Mario.

### A · Architektur-Frage · "Fetch-und-ablegen" (geparkt mit Trigger)

Phase-4-Nachläufer-Befund: Vercel-iad1-Lambda-IPs sind von Derivate-Börsen (Binance + Bybit verifiziert) geblockt. DeFiLlama, CoinGecko, Alternative.me, Coinbase, Open-Meteo, Twelve Data, Google iCal laufen normal — der Block ist anbieter-klassen-spezifisch, kein generisches Vercel-Netzwerk-Problem.

**Modell:** Externer Job aus einer kontrollierten IP holt periodisch die Daten, schreibt in Storage. Page rendert nur aus Storage.

**GEPARKT mit Trigger:** "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Trading-Indikator-Cards dort live."

**Cheap-Schritt-1 vor jedem Pipeline-Bau:** Verifizieren ob ein GitHub-Actions-Runner (Azure-IP-Range) Bybit oder Binance überhaupt erreicht. Falls nein → Residential-IP-Lösung nötig (eigener Mini-Server, Cloudflare Tunnel, bezahlter Proxy).

### B · Worktree-Cleanup (Mini-Task, in `_pendenzen.md` Mario-TODO)

Zwei verwaiste Claude-Code-Worktrees im Repo:
- `.claude/worktrees/crazy-roentgen-49029d` (5c4e8a1 · HQ-Pivot 12.5.)
- `.claude/worktrees/lucid-noyce-c570f5` (00535aa · Phase 2.2 · weit hinter main)

Aufräumen via `git worktree remove <pfad>` + ggf. `git branch -D <branch>`. Kein Risiko, nur Müll. An jeden künftigen Slice anhängbar.

### C · EventBanner-Wiederanschluss (falls je gewünscht)

In Slice 5.3 stillgelegt (aus index.astro ausgebunden). Datei `src/components/EventBanner.astro` bleibt im Repo mit Wiederanschluss-Anleitung im Header-Kommentar. ~10 min Arbeit: Import auf `macroEventsResolver` umstellen + neue Trigger-Helper + Felder-Mapping (MacroEvent hat keine `beschreibung`) + in index.astro wieder einhängen.

### D · Phase 6 / Phase 3 / Foto-Inspiration / Custom Domain (alle offen)

- **Phase 6 · Briefing-Erweiterungen:** Trade-Setups (Entry/SL/TP mit R:R), On-Chain & Sentiment (Glassnode ~$39/Monat — bezahlte API, eigene IP-Frage), Streaks-Tracker, Eigene Domain
- **Phase 3 · Content-Pipeline (zurückgestellt):** Trigger: Habits/Notizen-Tracking oder Archiv-Wunsch
- **Foto-Inspiration Slice 4.6b:** Konzept steht in `_pendenzen.md`, wartet auf Marios Metadaten-Felder-Entscheidung
- **Custom Domain (Phase 6):** keines der früheren Vercel-Projekte hatte je eine · `hq.dasdarugna.ch` o.ä. steht aus

---

## 4 · Bekannte Production-Issues

- **US-Datacenter-IP-Block · Derivate-Börsen-Klasse** (siehe §3 A) · Binance + Bybit von Vercel-iad1-IPs geblockt · 4 Trading-Indikator-Cards auf /wirtschaft zeigen "Fallback · Bybit offline"
- Sonst alles live auf Production

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.4)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan-First-Befund offen festhalten** wenn die GO-Annahme von der Realität abweicht — auch nach Code (5.2a `wmoSymbol`, 5.3 `parseIcal`)
- **Sanity-Checks gegen unabhängige Quellen** — nicht zirkulär (5.2a/5.2b SunCalc gegen `api.sunrise-sunset.org`)
- **Bau-Aufteilung innerhalb eines Slices** (4.5b/4.5c · 5.2a/5.2b) bleibt EIN Slice in der Phasen-Zählung
- **Konzept-Wechsel in der Slice-Freigabe sind ok** (5.3: EventBanner → stillgelegt, MacroCard → 3er-Vorausschau) — vereinfacht oft
- **UI-Wahrheits-Prinzip** · Mario-gepflegtes JSON ist kein "Live" → kein Live-Stempel (MacroCard-Pattern)
- **Daten-/View-Logik-Trennung** · Resolver liefern Werte, Cards formatieren
- **Defensive Empty-States** in jeder Card
- **Build-Test vor Push** · auch bei reinem docs-Commit

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- TypeScript strict · keine any
- `prerender = false` auf api/-Routes und `/` (seit 5.1)
- Vercel-Edge-Cache greift NICHT in `npm run dev`
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen
- Lokale Erreichbarkeit ≠ Vercel-Erreichbarkeit
- **Production-curl auf Inhalt warten, nicht Status** · grep-Schleife mit Nanosekunden-Bust ist die robuste Lösung (Status-200 ≠ Inhalts-Propagation)
- **icalFetcher liefert nur Tage MIT Terminen** (nicht alle 7) — defensive Datums-Lookup nötig wenn Wochen-Strip o.ä. lückenlos sein soll
- Stempel-Hygiene: Phase-Stempel steht an mehreren Stellen (CoverFooter + layout/Footer), alle gleichzeitig updaten
- Node-Skripte ausserhalb des Projekt-Roots können Projekt-Dependencies nicht resolven · Test-Skripte im Projekt-Root ablegen, danach löschen

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-5-COVER-SYNC-SPEC.md` · ABGESCHLOSSEN (15.5.2026)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · ABGESCHLOSSEN
- `docs/PHASE-2.2-COVER-SPEC.md` · ABGESCHLOSSEN · Layout-Pattern-Vorbild (frozen)
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · ABGESCHLOSSEN
- `_pendenzen.md` · Roadmap · Phase 5 ✅ · offene Themen ohne Slice-Framing
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 38 (Slice 5.4 + Phase-5-Synthese)

---

## 7 · Erster Schritt in der neuen Session

1. Mario entscheidet die nächste Richtung (§3 A/B/C/D)
2. claude.ai liest relevante Spec + Handover + Letzte SESSION_LOG-Einträge je nach Wahl
3. Plan-First in Claude Code · Slice-Ziel + Umfang klären
4. Slice ausführen

**Phase 5 ist ein abgeschlossenes Kapitel. Das HQ-MVP steht — Cover und alle Detail-Pages live. Die nächste Richtung ist offen.**
