---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Architektur-Entscheid oder nächster konkreter Slice
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 5.1

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

**Phase 4 · Charts + Trading-Watchlist — ABGESCHLOSSEN (14.5.2026).**

**Slice 5.1 · Bybit-Swap — Teil-Slice / eskaliert (14.5.2026).** Schnell-Fix-Pfad
für die Vercel-API-Block-Issue ist erschöpft. Bybit-Code bleibt auf main
(läuft lokal live, ehrliche UI-Wahrheit), aber das eigentliche Slice-Ziel
(4 Cards live auf Production) konnte strukturell nicht erreicht werden.

**Was auf Production live ist:**
- /wirtschaft: BTC Hero (CoinGecko) · Krypto-Sektion 12 Coins (CoinGecko) · Stablecoin Supply (DeFiLlama) · MacroTimeline · FearGreedGauge (Alternative.me) · Aktien + Forex (Twelve Data via Edge-Cache) · News · TradeSetupsPlaceholder
- /wetter: WetterDetail · WochenStrip · WetterWochenBars (ECharts) · AstronomieSektion mit Mondphase-SVG · FotoSpots — komplett (Open-Meteo + SunCalc)
- /kalender: iCal Read-Only Google Calendar
- /news: 4 Kategorien (statisch)
- /, /archiv, /habits, /workout, /zeit: Cover + Platzhalter

**Was auf Production NICHT live ist (4 Cards Fallback):**
- Funding Rates · Open Interest · Long/Short Ratio · Coinbase Premium
- Aktueller UI-Text: "Fallback · Bybit offline" (nach 5.1)
- Funktional identisch zum Stand vor 5.1, nur Quellen-Wahrheit aktualisiert

---

## 3 · Struktureller Befund · Bybit-Blocker (Slice 5.1)

**Bestätigt nach Production-Deploy von `91ef169` (14.5.2026):**

- **Binance Futures Public** — von Vercel-IPs geblockt (13.5.)
- **Bybit V5 Public** — von Vercel-IPs ebenfalls geblockt (14.5.)
- **DeFiLlama** — läuft weiter → Beleg: nicht generisches Netzwerk-Problem,
  sondern **anbieter-klassen-spezifischer Block (Derivate-Börsen)**
- **CoinGecko / Alternative.me / Coinbase Exchange Rates / Open-Meteo / Twelve Data** — alle live

**Routing:** Vercel deploy-Region `fra1` (Frankfurt-CDN) → SSR-Lambda `iad1`
(US-AWS, Northern Virginia). Bybit + Binance blocken US-Datacenter-IP-Ranges
wegen US-CFTC/Treasury-Compliance. **OKX bewusst nicht getestet** — gleiche
Compliance-Klasse, gleiches Risiko.

**Schnell-Fix-Pfad (Anbieter-Swap) ist erschöpft.**

---

## 4 · Was als Nächstes kommen könnte

### A · Architektur · "Fetch-und-ablegen" (Verbleibender Lösungs-Pfad)

Modell: Ein externer Job aus einer kontrollierten IP holt periodisch die
Daten, schreibt in Storage. Page rendert nur aus Storage.

**GEPARKT mit neuem Trigger:** "Mario nutzt /wirtschaft regelmässig auf
Production/Mobile und will die 4 Cards dort live."

**Schritt 1 vor jedem Pipeline-Bau (cheap):** Verifizieren ob ein
GitHub-Actions-Runner (Azure-IP-Range) Bybit oder Binance überhaupt erreicht.
- Falls JA → Pipeline-Optionen: GH-Actions cron alle 5–15 Min, schreibt JSON
  in Repo oder in Vercel KV/Upstash. Page liest aus Storage.
- Falls NEIN → Residential-IP-Lösung nötig (eigener Mini-Server, Cloudflare
  Tunnel zu Marios Netz, oder bezahlter Proxy). Deutlich grösserer Schritt.

Vor jeglichem Bauen: Schritt 1 entscheidet die Architektur.

### B · Phase 6 · Briefing-Erweiterungen

- Trade-Setups konkret (Entry/SL/TP mit R:R) auf /wirtschaft
- On-Chain & Sentiment (Glassnode ~$39/Monat — bezahlte API, eigene IP-Frage)
- Streaks-Tracker mit GitHub-Style Heatmap
- Eigene Domain (hq.dasdarugna.ch o.ä.)

### C · Foto-Inspiration Slice 4.6b

Voraussetzung: Mario entscheidet welche Metadaten-Felder pro Spot Sinn ergeben.
Konzept in `_pendenzen.md` festgehalten.

### D · Phase 3 · Content-Pipeline (zurückgestellt)

> *Ergänzung aus Claude-Code-Vorschlag · nicht aus 5.1-Besprechung · belegbar
> durch bestehende Phase-3-Doku in `_pendenzen.md` Roadmap-Sektion.*

Trigger: Habits/Notizen-Tracking oder Archiv-Wunsch.

### E · Hygiene-Slices (klein)

> *Ergänzung aus Claude-Code-Vorschlag · nicht aus 5.1-Besprechung ·
> belegbar durch bestehende Production-Issues + Worktree-Pendenz in
> `_pendenzen.md`.*

- Vercel-Doppel-Projekt `mario-hq` (ohne Custom Domain) löschen — Marios
  Dashboard-Hausaufgabe
- Lokale Worktree-Reste (crazy-roentgen, lucid-noyce) aufräumen — an
  jeden künftigen Slice anhängbar

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.1)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan-First mit explizit benannten Risiken** — Risiko #1 in 5.1 wurde
  benannt und ist materialisiert. Das ist nicht Plan-Versagen, sondern
  Plan-Disziplin: bekannte Wette mit bekannter Niederlage-Möglichkeit.
- **Live-API-Test vor Code** — 5.1 hat lokal verifiziert, aber Vercel-IP-
  Erreichbarkeit kann lokal nicht getestet werden, das ist der harte Punkt
- **UI-Wahrheit** — Eyebrows + Quellen-Labels müssen mit dem aktuellen
  Fetcher-Code übereinstimmen. "Binance offline" wo Bybit gemeint ist =
  UI-Lüge. Pflicht-Mit-Edit beim Anbieter-Swap.
- **Generic Feldnamen bei vergleichenden Werten** — `vergleichs_preis`
  statt `binance_preis`, kein Interface-Rename beim nächsten Wechsel
- **Sichtbare vs unsichtbare Änderungen trennen** (4.5b/4.5c-Pattern)
- **Build-Test vor Push** — Pflicht, auch bei reinem docs-Commit

**Stolpersteine:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- ENV-Vars: lokal in .env + beide Vercel-Projekte
- TypeScript strict · keine any
- prerender = false auf api/-Routes
- Vercel-Edge-Cache greift NICHT in npm run dev
- Vite-HMR-Cache-Bug nach `git mv` oder Komponenten-Edits: Dev-Server neu starten
- ECharts in Astro: client:visible bzw. Astro-Islands-Pattern
- ECharts-Gauge-Quirk: `title: { show: false }` explizit setzen
- **NEU (5.1):** Lokale Erreichbarkeit ≠ Vercel-Erreichbarkeit. Bei API-
  Wechseln muss der Production-Test in den Plan eingebaut sein, der
  lokale Live-Test reicht nicht für die strukturelle Frage.

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · ABGESCHLOSSEN
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, Production-Issues (5.1-Befund als strukturell dokumentiert)
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 33 (Slice 5.1)

---

## 7 · Erster Schritt in der neuen Session

1. Mario entscheidet welche Richtung (A Architektur · B Phase 6 · C Foto · D Phase 3 · E Hygiene)
2. claude.ai liest relevante Spec + Handover + die ersten 2-3 Updates im SESSION_LOG
3. Plan-First in Claude Code · Slice-Ziel + Umfang klären
4. Bei Pfad A: **erst Schritt 1 (GH-Actions-Runner-IP-Test) machen**, vor
   irgendeinem Pipeline-Bau — entscheidet die Architektur

**Phase 4 ist ein abgeschlossenes Kapitel. Das HQ-MVP steht funktional
auf /wirtschaft + /wetter, die 4 Trading-Cards bleiben als bekannte
Production-Lücke mit strukturellem Befund und klarem Verbleib-Pfad.**
