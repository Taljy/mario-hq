---
typ: handover
projekt: mario-hq
erstellt: 26-05-14
zweck: Nahtloser Übergang in neue claude.ai-Session + neue Claude-Code-Session
gilt-bis: Slice 4.5c abgeschlossen · danach neues Handover
---

# Handover · Mario's HQ · Stand 14.5.2026 · nach Slice 4.5b

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
- Slice 4.5b ✅ Krypto-Card-Rebuild · gemeinsame AssetCard · neue Krypto-Block-Struktur · Aktien-Doppelung weg (NICHT Spec-Slice, IA-Umbau nach Mario-Wunsch)
- **Slice 4.5c ← NÄCHSTER SCHRITT** · interner Daten-Architektur-Cleanup (kein sichtbarer Effekt)
- Slice 4.6 Wetter-Wochen-Bars + Mondphase-SVG (Spec §7.6)
- Slice 4.7 Macro-Timeline + Fear & Greed Gauge (Spec §7.7)
- Slice 4.8 Polish + Volltest + Phase-Abschluss (Spec §7.8)

Commits Slice 4.5b: feat `9ee82e2` · docs ausstehend (mit diesem Handover-Push)

---

## 3 · Nächster Schritt · Slice 4.5c · Daten-Architektur-Cleanup

**Reiner Refactor-Slice. Kein Pixel ändert sich.** Mario hat 4.5b/4.5c bewusst
geteilt: sichtbarer Card-Rebuild (4.5b ✅) zuerst, unsichtbarer interner Cleanup
(4.5c) danach. Verifikation von 4.5c ist andersartig: "es hat sich nichts
sichtbar geändert UND Build grün UND Live-Werte unverändert".

**Was 4.5c macht:**
- `src/lib/watchlistAggregator.ts` → `src/lib/kryptoAggregator.ts` Rename
- Refactor zum reinen Krypto-Aggregator:
  - `tdMapVorgegeben`-Parameter entfernen (kein twelvedata-Pfad mehr nötig — watchlist.json hat keine twelvedata-Items mehr)
  - `getTwelveDataStand`-Import entfernen
  - twelvedata-Branch im Gruppen-Loop entfernen
- Typ-Renames (öffentlich exportierte Typen aus dem Aggregator):
  - `WatchlistItem` → `KryptoItem`
  - `WatchlistGruppe` → `KryptoGruppe` (Typ! nicht zu verwechseln mit der gleichnamigen Astro-Komponente)
  - `WatchlistItemEnriched` → `KryptoItemEnriched`
  - `WatchlistGruppeEnriched` → `KryptoGruppeEnriched`
  - `WatchlistErgebnis` → `KryptoWatchlistErgebnis`
- Funktion `getWatchlist()` → `getKryptoWatchlist()` (semantisch klarer)
- Konsequenz-Anpassungen:
  - `KryptoSektion.astro` + `KryptoGruppe.astro` (Komponente) · Import-Pfade + Typ-Namen
  - `wirtschaft.astro` · Import + Aufruf
  - Falls weitere Caller existieren — grep prüfen

**Konflikt-Hinweis:** Es gibt eine Komponente `KryptoGruppe.astro` und der Typ
`WatchlistGruppe` wird zu `KryptoGruppe` umbenannt — gleicher Name an zwei
Stellen. Astro/TypeScript trennt das sauber (eine ist Component, eine ist Type),
aber für Lesbarkeit ggf. den Typ `KryptoGruppeDef` o.ä. nennen. Beim Plan-First
in 4.5c klären.

**Test-Linie für 4.5c:**
- Build grün
- Vor/Nach-Screenshot von /wirtschaft auf Production zeigt identischen Output
- Live-Werte aller 12 Krypto-Coins unverändert
- AktienSektion + ForexCommoditiesSektion sind nicht betroffen (lesen aus aktien.ts/forex.ts)

**Geschätzter Umfang:** ~30-45min. Kleiner als 4.5b, reines Find-and-Replace +
Import-Anpassungen + Build-Verifikation.

---

## 4 · Kleinaufgaben (einschiebbar)

- **Cover-Phasen-Stempel** · auf der Cover-Page steht unten rechts noch
  "MARIO'S HQ · V0.1 · PHASE 2.2" — separates Layout-Meta-Element, nicht der
  globale Footer (der ist schon auf "Phase 4"). Trivialer Mini-Hygiene-Fix.
  In `_pendenzen.md` notiert.
- **Spec-Sync §7.4 + §7.5** · DRINGEND geworden. Die Phase-4-Spec beschreibt
  eine /wirtschaft-Realität, die es nicht mehr gibt: §7.4 redet vom alten
  TradingView-Schema ("Move2Earn"), §7.5 hat zwar einen Realitäts-Hinweis am
  Anfang (in 4.5 ergänzt), ist im Kern aber überholt. Mit dem 4.5b-Rebuild ist
  die IA ein weiteres Mal anders geworden (zwei Krypto-Blöcke, gemeinsame
  AssetCard, Aktien nicht mehr in der Watchlist). Sinnvoll, den Spec-Sync NACH
  4.5c zu machen, wenn die Daten-Architektur final ist.

---

## 5 · Bekannte Production-Issues (nicht blockierend für 4.5c)

### 5.1 · Vercel blockt Binance-API
Auf Production zeigen 4 Trading-Indikator-Cards "FALLBACK · BINANCE OFFLINE"
(Funding Rates, Open Interest, Long/Short Ratio, Coinbase Premium). Lokal
funktioniert alles. Geo-/IP-Block von Binance gegen Vercel-Server-IPs.
→ **Mini-Reparatur-Slice.** Lösungswege: Edge-Function-Proxy, alternative API
(Bybit/OKX), oder pragmatisch akzeptieren. Twelve Data und CoinGecko haben
keine Geo-Blocks.

### 5.2 · Vercel-Doppel-Projekt
Zwei Vercel-Projekte deployen dasselbe Repo: `mario-hq` und `mario-hq-qc6f`.
Jeder Push baut doppelt, ENV-Vars doppelt gepflegt. `mario-hq-qc6f` ist
kanonisch. **`qc6f` hat KEINE Custom Domain** (verifiziert 14.5.) — das
überzählige `mario-hq`-Projekt kann gefahrlos gelöscht werden.
→ **Mini-Hygiene-Slice.**

### 5.3 · Twelve Data Free Tier · harte Limits
Aus Slice 4.5: 8 Credits/min UND 800 Credits/Tag, je 1 Credit pro Symbol im
Bulk-Call. Hat die Endpoint-Architektur erzwungen (zwei getrennte API-Routes
mit geteiltem Edge-Cache + stale-while-revalidate). Indizes, Commodities,
SILVER/BRENT sind im Free Tier nicht verfügbar — bewusst weggelassen.

---

## 6 · Mini-Slices die zwischendrin eingeschoben werden können

- **Mini-Reparatur · Vercel-Binance-Block** · diagnostizieren und lösen
- **Mini-Hygiene · Vercel-Doppel-Projekt** · `mario-hq` löschen (gefahrlos, keine
  Domain), `qc6f` als kanonisch bestätigen, Doku-URLs prüfen
- **Mini-Hygiene · Cover-Phasen-Stempel** · "PHASE 2.2" → "Phase 4"

**Empfehlung:** Slice 4.5c direkt — kleiner reiner Refactor, schliesst den IA-
Umbau sauber ab. Die Mini-Slices sind nicht blockierend.

---

## 7 · Etablierte Arbeitsweise (bewährt über Phase 2.2-4.5b)

- **Spec-First** · Plan-First · Slice-Pattern (feat-Commit + docs-Commit)
- **Foundation-First** · Pattern-Klon · Verifikation: Build grün → Light/Dark/Mobile → Console → Vercel HTTP 200
- **GO-Prompt-Stil:** claude.ai schreibt ausführliche strukturierte GO-Prompts,
  Mario kopiert sie in den Claude-Code-Chat
- **Plan-First bewährt sich stark:** In Slice 4.5 hat der API-Test-vor-Code-Schritt
  zwei strukturelle Probleme aufgedeckt (WTI/GOLD-Symbol-Konflikt, 8/min-Limit),
  bevor falscher Code entstand. Bei komplexen Slices mehrere Plan-Runden machen.
- **Slice-Aufteilung sichtbar/unsichtbar:** In 4.5b/4.5c bewährt: sichtbare
  Arbeit zuerst (Mario kann es prüfen), unsichtbare Refactor-Arbeit danach.
- **Stil-Treue:** Schweizer Hochdeutsch, du-Form, Em-Dash, Mittelpunkt, DRG-Tokens

**Stolpersteine die immer gelten:**
- Worktree-Falle · `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen
- Build-Test vor Push · Pflicht, auch bei Doc-Änderungen
- ENV-Vars: lokal in .env (gitignored) + beide Vercel-Projekte · Redeploy nötig
- TypeScript strict · keine any
- prerender = false auf api/-Routes (SSR, sonst Build-Zeit-statisch)
- Vercel-Edge-Cache greift NICHT in npm run dev — Cache-Verifikation immer auf Production
- Claude-Code-Preview-Browser kann nur localhost öffnen, keine Vercel-URLs —
  Production-Verifikation via curl/HTTP-Checks, nicht Preview-Rendering
- CoinGecko-Rate-Limit · Bulk-Call für alle Coin-IDs, nicht einzeln
- Vite-HMR-Cache-Bug nach `git mv`: Dev-Server neu starten (Production-Build ist trotzdem sauber)

---

## 8 · Spec-/Doku-Files im Repo

- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · aktuelle Phase · §7.4+§7.5 sind
  durch die Realität überholt (Spec-Sync nach 4.5c geplant)
- `docs/PHASE-2.2-COVER-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` · abgeschlossen · Pattern-Vorbild
- `_pendenzen.md` · Roadmap, offene Fragen, Production-Issues
- `_projekt.md` · Architektur, Entscheidungen, Mario-Kontext
- `SESSION_LOG.md` · chronologisches Log · letzter Eintrag Slice 4.5b (Update 27)

---

## 9 · Erster Schritt in der neuen Session

1. Neue claude.ai-Session: dieses Handover als ersten Input geben
2. claude.ai baut den GO-Prompt für Slice 4.5c — mit dem Konflikt-Hinweis aus
   §3 (Komponenten-Name `KryptoGruppe` vs. Typ `KryptoGruppe` → eventuell Typ
   als `KryptoGruppeDef` benennen)
3. Plan-First in Claude Code · grep auf alle Caller von WatchlistErgebnis &
   getWatchlist als ersten Schritt
4. Reines Find-and-Replace + Import-Anpassungen · Build-Test · vor/nach
   Production-Vergleich (Live-Werte identisch)

**Empfehlung:** Slice 4.5c direkt. Reiner Refactor, kein Risiko für sichtbare
Regression solange der Build grün ist.
