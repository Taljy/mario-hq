---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 5.4 begonnen oder abgeschlossen (Phase-5-Abschluss)
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Phase 5 Slice 5.3

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

**Phase-4-Nachläufer-Slice** · Binance/Bybit-Swap — eskaliert (Commits `91ef169` + `7de6592`). Schnell-Fix-Pfad erschöpft. Architektur-Frage geparkt.

**Phase 5 · Cover-Sync — kurz vor Abschluss (14.5.2026).**

Phase-5-Status:
- Slice 5.1 ✅ SSR-Foundation + KryptoCard live (feat `7af3bf9`)
- Slice 5.2 ✅ WetterCard live · Bau-Aufteilung 5.2a/5.2b
  - 5.2a ✅ `getStundenHeute()` (feat `8decc27`)
  - 5.2b ✅ WetterCard-Live-Swap + nauticalDusk (feat `a5ffb9e`)
- Slice 5.3 ✅ Kalender + Macro + News live · EventBanner stillgelegt (feat `e491b44`)
- **Slice 5.4 ← LETZTER SCHRITT · PHASE-5-ABSCHLUSS** · Polish + Volltest + Cover-Stempel + Doku-Abschluss

### Cover-Stand: alle 5 Cards live ✅

| Card | Status | Quelle |
|---|---|---|
| KryptoCard | ✅ live | CoinGecko + Alternative.me |
| WetterCard | ✅ live | Open-Meteo + SunCalc + FotoSpotPicker |
| KalenderCard | ✅ live | iCal (Google Calendar Read-Only) |
| MacroCard | ✅ live | macroEventsResolver (3er-Vorausschau · kein Puls · kein Live-Stempel) |
| NewsCard | ✅ live | news-voll.cover_headlines (Mario-gepflegt, Single-Source mit /news) |
| EventBanner | stillgelegt | aus index.astro ausgebunden · Datei bleibt für Wiederanschluss |

**Production live auf `mario-hq-qc6f.vercel.app/`:** alle 5 Cards mit echten Daten. Der Phase-5-Hauptzweck ist materiell erreicht — 5.4 ist nur noch Polish + Abschluss.

**Zur Slice-Nummerierung:** Phase 5 = 5.1, 5.2, 5.3, 5.4 (4-Slice-Zählung). 5.2 intern 5.2a/5.2b (Bau-Aufteilung). Frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* war Phase-4-Nachläufer-Label, Commits per SHA referenziert.

---

## 3 · Nächster Schritt · Slice 5.4 · Polish + Phase-5-Abschluss

**Spec §5.4.** Letzter Phase-5-Slice. Polish + Verifikation + Abschluss-Doku.

**Tasks laut Spec + 5.3-Befunde:**

1. **Volltest /-Cover** Light/Dark/Mobile 375px komplett
2. **Card-Head Mobile-Wrap-Befund anschauen** (5.2b/5.3-Notiz)
   - Nur WetterCard wrappt auf 375px (`"WETTER & FOTO · BADEN AG"` + Live-Stempel zu lang)
   - KalenderCard, KryptoCard passen einzeilig (kürzere Eyebrows)
   - MacroCard hat keinen Stempel → kein Wrap-Problem
   - **Entscheidung in 5.4:** WetterCard-spezifischer Fix (Eyebrow kürzen?) vs. zentrales Pattern (Stempel auf zweite Zeile bei langem Eyebrow) — Marios Wahl. Oder akzeptieren als bewusste Mobile-Aussage.
3. **Cover-Stempel** in `CoverFooter.astro` von `"Phase 4"` → `"Phase 5"` (Hygiene)
4. **Console + Performance-Check** lokal + Production
5. **Phase-5-Synthese in SESSION_LOG** mit allen Slice-Erkenntnissen (Mario-Konzept-Wechsel, Plan-First-Befunde, Stolpersteine, Sanity-Check-Pattern)
6. **Spec abschliessen** — `docs/PHASE-5-COVER-SYNC-SPEC.md` Frontmatter-Status auf "abgeschlossen"
7. **HANDOVER neu** für Post-Phase-5-Stand

**Geschätzter Umfang:** klein-mittel · keine Code-Logik-Änderung ausser Cover-Stempel + ggf. Mobile-Wrap-Fix.

---

## 4 · Bekannte Production-Issues (nicht blockierend für 5.4)

- **US-Datacenter-IP-Block · Derivate-Börsen-Klasse** *(struktureller Befund 14.5.)* — Binance + Bybit von Vercel-iad1-IPs geblockt. Verbleibender Pfad: Architektur (Fetch-und-ablegen) **GEPARKT** mit Trigger "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live".
- **WetterCard Mobile 375px** · card-head wrappt zweizeilig. Slice 5.4 entscheidet.
- **EventBanner stillgelegt** · Wiederanschluss-Anleitung im Datei-Header (~10 min Arbeit) falls Mario es zurück will.

---

## 5 · Etablierte Arbeitsweise (bewährt über Phase 2.2–5.3)

- **Spec-First · Plan-First · Slice-Pattern** (feat-Commit + docs-Commit)
- **Plan-First-Befund offen festhalten** wenn die GO-Annahme von der Realität abweicht (Beispiele: 5.2a vermutete Refactor-Schuld, 5.3 Wochen-Strip-Logik-Bug)
- **Sanity-Checks gegen unabhängige Quellen** — nicht zirkulär. SunCalc gegen `api.sunrise-sunset.org` validiert.
- **Bau-Aufteilung innerhalb eines Slices** (4.5b/4.5c · 5.2a/5.2b · 5.3 in einem Schub) — Slice-Nummerierung bleibt unverändert
- **Konzept-Wechsel in der Slice-Freigabe sind ok** (5.3: EventBanner → stillgelegt, MacroCard → 3er-Vorausschau) — vereinfacht oft den Slice
- **Daten-/View-Logik-Trennung** · Resolver liefern Werte, Cards formatieren
- **UI-Wahrheit** — Stempel/Quellen-Labels stimmen mit Fetcher-Code überein. Mario-gepflegtes JSON ist kein "Live" → kein Live-Stempel (MacroCard-Pattern)
- **Defensive Empty-States** in jeder Card (0 Termine / 0 Events / 0 Headlines · "frei" / "Keine ... heute" / italic Leer-Hinweise)
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
- **Production-curl: auf Inhalt warten, nicht Status** — robuste Schleife mit `grep -q` auf erwarteten neuen Wert + Nanosekunden-Bust. Status-200 ≠ Inhalts-Propagation. In 5.3 klappte's in Iteration 1, in 5.2b brauchte es 2-3 Versuche — Schleife ist die robuste Lösung
- **icalFetcher liefert nur Tage MIT Terminen** (nicht alle 7) — defensive Wochen-Strip-Generierung über explizite Datum-Offsets (5.3-Befund)
- Node-Skripte ausserhalb des Projekt-Roots können Projekt-Dependencies nicht resolven — Test-Skripte im Projekt-Root ablegen (z.B. `_test-xyz.mjs`, danach löschen)

---

## 6 · Spec-/Doku-Files im Repo

- `docs/PHASE-5-COVER-SYNC-SPEC.md` · in Arbeit · §2-Status: 5.1+5.2+5.3 ✅, 5.4 offen
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · abgeschlossen
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Layout-Pattern-Vorbild (frozen)
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen
- `_pendenzen.md` · Roadmap · Phase 5 aktiv · Slice 5.3 ✅
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Update 37 (Slice 5.3)

---

## 7 · Erster Schritt in der neuen Session · Slice 5.4

1. claude.ai liest §5.4 der Phase-5-Spec + die letzten 3 SESSION_LOG-Einträge (35/36/37)
2. Sieht durch: Volltest + Mobile-Wrap-Entscheidung + Cover-Stempel-Update + Doku-Abschluss
3. Baut GO-Prompt für 5.4 mit konkretem Entscheid zur Mobile-Wrap-Frage
4. In Claude Code: Plan-First mit Reihenfolge der Polish-Items

**Empfehlung:** 5.4 ist der Abschluss-Slice. Sauber durchziehen, danach ist Phase 5 ein abgeschlossenes Kapitel und das HQ steht mit komplettem Live-Cover.
