# Mario's HQ · Session Log

## 26-05-15 (Update 38) · Phase 5 · Slice 5.4 · Polish + Phase-5-Abschluss

### Was gemacht (Slice 5.4)
- `src/components/CoverFooter.astro` · "Phase 4" → "Phase 5" (Stempel-Hygiene)
- `src/components/layout/Footer.astro` · "· Phase 4" → "· Phase 5" (zweiter Stempel-Ort, Lehre aus 4.8 — beide Stellen gleichzeitig)
- `src/components/WetterCard.astro` · Eyebrow von `"Wetter & Foto · {ort}"` auf `"Wetter · {ort}"` gekürzt · Mario-Entscheidung Variante A · löst den 375px-card-head-Wrap (5.2b-Befund). Lokal verifiziert: einzeilig auf Mobile.
- `src/components/KalenderCard.astro` · `ersterTerminWort()` um `.replace(/[:;,.\-–—]+$/, '')` ergänzt · Mario-Entscheidung Variante A · "Daniela:" → "Daniela", robust gegen weitere Satzzeichen-Varianten
- Verifikations-`grep -rn "Phase 4" src/`: leer · keine Phase-4-Strings mehr in src/

### Verifikation
- `npm run build` grün
- Dev-Server-Restart (HMR-Falle)
- /-Cover Light/Dark/Mobile 375px:
  - WETTER · BADEN AG + Live-Stempel einzeilig auf Mobile ✓ (Wrap weg)
  - Wochen-Strip "Fr Zahnarzt · Sa frei · So frei · Mo Daniela · Di frei · Mi frei · Do frei" (Daniela ohne Doppelpunkt) ✓
  - Beide Footers zeigen "Phase 5" ✓
  - Console clean
- /wirtschaft + /wetter + /kalender + /news HTTP 200 (Sicherheits-Check)
- Production via grep-Schleife: Phase 5 + neue Eyebrow propagiert in Iteration 5 (~12 s · diesmal hat's etwas gedauert, bestätigt nochmal: Status-200 wäre nicht genug gewesen, grep-auf-Inhalt-Pattern ist die robuste Lösung)

### Hinweis · Lighthouse-Spot-Check
Im GO erwähnt aber Preview-Tools liefern keinen Lighthouse-Output direkt. Console clean + Build-Output-Sanity-Check (kein Chunk-Bloat ausser bekanntem ECharts-Warning) als Ersatz. Falls Mario tiefer prüfen will: `npx unlighthouse --site mario-hq-qc6f.vercel.app` lokal oder Chrome-DevTools-Lighthouse-Tab manuell — nicht Teil dieses Slice.

---

## Phase-5-Synthese · Cover-Sync · 14.5.–15.5.2026

**Ziel:** Cover (/) von statischen Stub-JSONs auf Live-Quellen umstellen. Bewusst alle 5 Cards in einer Phase. KryptoCard nur CoinGecko, keine Trading-Indikatoren (würden Vercel-IP-Block aus Phase-4-Nachläufer auf die Startseite vererben).

### Phase-5-Status · 4 Slices (5.2 intern in 5.2a/5.2b, Bau-Aufteilung wie 4.5b/4.5c)

| Slice | Kernarbeit | Mario-Entscheidung |
|---|---|---|
| 5.1 | Spec + SSR-Foundation (prerender=false + Cache-Header + Promise.all) + KryptoCard live | Spec als erster Task in 5.1, kein Vor-Slice |
| 5.2a | `getStundenHeute()` in astronomieResolver (SunCalc Golden/Blue Hour) | Plan-Befund: wmoSymbol-Helper unnötig — Bau-Aufteilung 5.2a/5.2b |
| 5.2b | WetterCard live-Swap + Inline-SonneWolken-SVG durch Wrapper ersetzt + Stub-Files gelöscht | Blaue-Stunde-Definition `sunset → nauticalDusk` (≈ 82 min · erweitertes fotografisches Fenster · Card als Inspirations-Werkzeug) |
| 5.3 | KalenderCard (icalFetcher) + MacroCard-Konzept-Wechsel + NewsCard (cover_headlines) + EventBanner stillgelegt | MacroCard = ruhige 3er-Vorausschau (statt Pulse-Card) · EventBanner ausgebunden (Datei bleibt) · NewsCard Single-Source via news-voll.cover_headlines |
| 5.4 | Polish + Phase-Stempel beide auf "Phase 5" + WetterCard-Eyebrow-Kürzung + KalenderCard-Satzzeichen-Fix + Abschluss-Doku | Wetter-Eyebrow Variante A ("Wetter · Baden AG") · Satzzeichen-Fix Variante A |

### Kern-Erkenntnisse Phase 5

1. **Stub-Daten sind handgefräst-ordentlich · echte Daten haben Lücken** · Beispiel `icalFetcher.parseIcal()`: liefert nur Tage MIT Terminen, leere Tage fehlen komplett. Wochen-Strip-Logik musste defensive umgebaut werden (explizite 7-Tage-Generierung mit `tageMap.get(iso)`-Lookup, "frei" als Default). Stub-JSON hatte einen fertigen formatierten String — die Anbindung an echte Daten musste die Lücke füllen.

2. **Edge-Cache-grep-Schleife als gelöster Stolperstein** · Status-200 ≠ Inhalts-Propagation. `until curl -sf` sagt nur dass die Lambda läuft, nicht dass die neue Version durchgereicht ist. Die Schleife `for i in seq 1 N; do curl | grep -q "neuer Wert" && break; sleep 3; done` mit Nanosekunden-Bust ist robust. Iterations-Bedarf variierte: 5.1 (sofort), 5.2b (mehrere), 5.3 (sofort), 5.4 (5 Iterationen). Bestätigt: kein separater Helper-Posten nötig, die Schleife selbst IST die Lösung.

3. **UI-Wahrheits-Prinzip beim Live-Stempel** · Mario-gepflegtes JSON ist kein Live-Fetch → kein "Live · 23:31 CEST"-Stempel auf MacroCard. Die Card hat einen einseitigen card-head (nur Eyebrow links). Bonus: kein Mobile-Wrap-Problem. Pattern: Live-Stempel nur bei echtem Live-Fetch (Open-Meteo, CoinGecko, iCal). Bei Mario-gepflegtem JSON (macro-events.json, news-voll.json): kein Stempel.

4. **Plan-First-Befunde offen festhalten · auch wenn GO-Annahme falsch war** · 5.2a deckte auf: "Refactor-Schuld aus 2.3.3" existierte nicht (`WetterSymbol.astro` war bereits zentralisiert). 5.3-Wochen-Strip-Bug wurde vor Push gefunden. Beide Befunde sind im SESSION_LOG ehrlich festgehalten — nicht überschrieben. Plan-First spart hier echte Doppel-Arbeit.

5. **EventBanner stillgelegt als bewusste Vereinfachung** · Mario-Konzept-Wechsel in 5.3-Freigabe: statt Banner + MacroCard synchron zu pulsen, EventBanner ganz weg und MacroCard übernimmt mit ruhiger 3er-Vorausschau. Spart Shared Helper + Synchronitäts-Verifikation. Komponente bleibt im Repo mit Wiederanschluss-Anleitung im Header — ~10 min Wiederanschluss möglich falls je gewünscht.

6. **MacroCard-Konzept-Wechsel zu 3er-Vorausschau** · von "heutiges Event" (1 Zeile) auf "nächste 3 wichtige Events" (kritisch || hoch, ab heute, chronologisch). Card wird Inspirations-Liste statt Trigger-Karte. Datum-Format "Heute" / "DD. Monat". Defensive bei 0/1/2 Events (Empty-State greift bei nicht-gepflegter JSON).

### Bewährte Pattern Phase 5 (zusätzlich zu Phase-4-Pattern)
- Bau-Aufteilung innerhalb eines Slices (5.2a/5.2b) wie 4.5b/4.5c · bleibt EIN Slice in der Phasen-Zählung
- Sanity-Check gegen unabhängige Quelle vor Code-Touch (5.2a/5.2b: `api.sunrise-sunset.org` für SunCalc-Werte)
- Datentest-Skripte im Projekt-Root ablegen (`_test-xyz.mjs`, danach löschen) wegen Dependency-Auflösung
- grep-auf-Inhalt-Schleife für Production-Verifikation (Nanosekunden-Bust)
- Konzept-Wechsel in der Slice-Freigabe sind ok und oft vereinfachend (5.3)

### Cover-Stand nach Phase 5
Alle 5 Cards live auf `mario-hq-qc6f.vercel.app/`:
- KryptoCard (CoinGecko BTC-Preis + Fear & Greed)
- WetterCard (Open-Meteo + SunCalc Golden/Blue Hour + FotoSpotPicker)
- KalenderCard (Google iCal Read-Only + defensive Wochen-Strip-Generierung)
- MacroCard (macroEventsResolver 3er-Vorausschau · kein Live-Stempel · keine Pulse)
- NewsCard (news-voll.cover_headlines · Mario-gepflegt · Single-Source mit /news)

EventBanner stillgelegt (Datei bleibt). Phase-Stempel auf "Phase 5" an beiden Footer-Stellen.

### Offene Themen nach Phase 5 (siehe HANDOVER §3)
- Architektur-Frage Fetch-und-ablegen für Phase-4-Nachläufer-Issue (geparkt mit Trigger)
- EventBanner-Wiederanschluss (~10 min falls je gewünscht)
- Worktree-Cleanup (crazy-roentgen, lucid-noyce — in _pendenzen, nie erledigt)
- Custom Domain (Phase 6)
- Phase 6 / Phase 3 / Foto-Inspiration 4.6b — alle Optionen offen

### Files dieser Session (5.4)
- `src/components/CoverFooter.astro` (Phase-5-Stempel)
- `src/components/layout/Footer.astro` (Phase-5-Stempel)
- `src/components/WetterCard.astro` (Eyebrow gekürzt)
- `src/components/KalenderCard.astro` (Satzzeichen-Fix)
- `docs/PHASE-5-COVER-SYNC-SPEC.md` (Status ABGESCHLOSSEN · §2 + §5.4)
- `_pendenzen.md` (Phase 5 ✅ · Roadmap ✅)
- `SESSION_LOG.md` (Update 38 mit Phase-5-Synthese)
- `docs/HANDOVER.md` (Stand nach Phase 5 · offene Themen ohne Slice-Framing)

---

## 26-05-14 (Update 37) · Phase 5 · Slice 5.3 · Kalender + Macro + News live · EventBanner stillgelegt

### Konzept-Wechsel in der 5.3-Freigabe (Mario)
Original-Plan: MacroCard zeigt heutiges Event mit Pulse-Animation synchron zum EventBanner. **In der 5.3-Freigabe von Mario geändert:**
- MacroCard = **3er-Vorausschau** auf wichtige Events (kritisch || hoch) · keine Pulse · kein Live-Stempel · ruhige Liste
- EventBanner **stillgelegt** (nicht gelöscht) · aus index.astro ausgebunden · Datei bleibt für Wiederanschluss
- Damit entfallen: Shared Helper `getHeutigesBannerEvent()` · Pulse/Banner-Synchronitäts-Verifikation · Trigger-Zählungs-Live-Test 14.5.

Begründung Mario: ruhigerer Cover-Charakter · die Macro-Information bleibt prominent (3-Event-Liste), nur ohne Animation und Banner-Doppel.

### Was gemacht
- `src/lib/macroEventsResolver.ts` · neue Funktion `getNaechsteWichtigeEvents(anzahl = 3): MacroEvent[]` · filtert `kritisch || hoch`, ab heute, chronologisch · defensive (2/1/0 bei dünnem Fenster)
- `src/data/news-voll.json` · neues Feld `cover_headlines: string[]` mit 3 initialen Headlines (aus alter news.json übernommen) · `_schema_doku`-Block ergänzt
- `src/lib/newsResolver.ts` · `getNewsHeute()` zieht aus `vollData.cover_headlines` · `news.json`-Import komplett raus
- `src/components/MacroCard.astro` · komplett neu gebaut:
  - 3er-Vorausschau · Datum-Format `"Heute"` / `"DD. Monat"` · Mobile-Grid für Event-Zeilen
  - Kein Live-Stempel · einseitiger card-head (UI-Wahrheits-Prinzip: kein Live-Fetch)
  - Empty-State: italic `"Keine wichtigen Macro-Events in den nächsten 14 Tagen."` (greift bei nicht-gepflegter JSON)
  - **Komplett entfernt:** Indizes-Zeile (Frontmatter + Template + CSS + Quelle) · Pulse-Animation (event-aktiv-Klasse + hq-pulse-border-Keyframes hell+dark + prefers-reduced-motion + event-marker)
- `src/components/KalenderCard.astro` · komplett neu gebaut:
  - Live-Stempel mit eigener Zeit (icalFetcher liefert keinen `fetch_zeit`)
  - Heute-Termine via `tageMap.get(heuteIso)` · Empty-State `"Heute frei."`
  - Wochen-Strip: defensive für 7 Tage explizit ab morgen aufbauen (siehe Logik-Bug unten)
- `src/components/EventBanner.astro` · STILLGELEGT · Header-Kommentar mit Wiederanschluss-Anleitung · Import auf `eventResolver` bleibt drin (broken weil Resolver gelöscht, aber Komponente nicht imported → Build grün)
- `src/pages/index.astro` · Promise.all erweitert um `getKalenderTermine()` · EventBanner-Import + Render-Stelle entfernt · KalenderCard erhält Props · MacroCard/NewsCard lesen selbst

Gelöscht:
- `src/lib/kalenderResolver.ts` + `src/data/kalender.json`
- `src/lib/macroResolver.ts` + `src/data/macro.json`
- `src/lib/eventResolver.ts` + `src/data/events.json`
- `src/data/news.json`

### Logik-Bug vor Push gefunden + gefixt
Erster Bau hatte Wochen-Strip via `ergebnis.tage.slice(1, 8)`. Lokaler Test zeigte: Wochen-Text war `"Mo Daniela:"` statt 7 Tage. Befund: `icalFetcher.parseIcal()` baut `tage`-Array **nur aus Tagen MIT Terminen** (Map-basiert, leere Tage werden nicht hinzugefügt). Bei Marios iCal heute (14.5.) hatte nur Montag (19.5.) einen Termin → `tage.length === 2`, Wochen-Strip zeigte 1 Eintrag.

**Fix:** Wochen-Strip über `Array.from({length: 7})` mit explizitem Datum-Offset · pro Tag in `tageMap = new Map(tage.map(...))` nachschauen · `"frei"` als Default. Heute-Block analog umgestellt (`tageMap.get(heuteIso)` statt `tage[0]`).

Diese defensive Logik ist nicht für die Cover-Card spezifisch wichtig — sie ist generell sauberer wenn der icalFetcher-Vertrag das so handhabt. Falls jemand in Zukunft `icalFetcher` anders interpretiert: Card-Logik bleibt korrekt.

### Mobile-Befund 5.3 (ergänzt 5.2b)
Auf 375px wrappt der `card-head` nur bei WetterCard (Eyebrow `"WETTER & FOTO · BADEN AG"` ist zu lang). Die in 5.3 neuen Cards:
- **KalenderCard** `"KALENDER · HEUTE"` + Live-Stempel passt **einzeilig** (kürzere Eyebrow)
- **MacroCard** hat keinen Live-Stempel (UI-Wahrheits-Prinzip) → kein Wrap-Problem überhaupt

Wrap-Problem ist also nicht systematisch sondern WetterCard-spezifisch. Slice 5.4 ist der Ort für ggf. Anpassung — entweder WetterCard-spezifisch oder zentrales Pattern.

### Production-curl-Schleife (auf Inhalt, nicht Status)
Statt nur `until curl -sf` (Status-200) wurde dieses Mal eine `grep`-Schleife auf einen erwarteten Inhalt verwendet:
```bash
for i in $(seq 1 40); do
  curl -s "...?cb=$(date +%s%N)" | grep -q "US · Retail Sales April" && break
  sleep 3
done
```
Klappte sofort in Iteration 1 — diesmal keine Edge-Cache-Verzögerung. Die Schleife selbst ist die robuste Lösung des HANDOVER-§5-Stolpersteins · kein separater Helper-Posten in _pendenzen nötig.

### Verifikation
- `npm run build` grün (auch nach Logik-Bug-Fix)
- Dev-Server-Restart (HMR-Falle)
- Lokal /-Cover:
  - KryptoCard ✅ live (5.1)
  - WetterCard ✅ live (5.2) · 6° Regenschauer S 5 km/h · GS 20:11—20:56 · BS 20:56—22:19 · "Heute drinnen — Regen oder Gewitter erwartet."
  - KalenderCard ✅ live (5.3) · "Heute frei." · Wochen-Strip "Fr Zahnarzt · Sa frei · So frei · Mo Daniela: · Di frei · Mi frei · Do frei"
  - MacroCard ✅ live (5.3) · 3 Zeilen · Heute 14:30 US Retail Sales / 20. Mai 08:00 UK CPI / 20. Mai 20:00 US FOMC Minutes
  - NewsCard ✅ live (5.3) · 3 Headlines aus cover_headlines
  - EventBanner weg
- Light + Dark sauber · Console clean
- /wirtschaft + /wetter + /news + /kalender HTTP 200 (Sicherheits-Check)
- Production via grep-Schleife: alle 5.3-Werte propagiert in Iteration 1

### Cover-Stand nach Slice 5.3
- KryptoCard ✅ live · WetterCard ✅ live · KalenderCard ✅ live · MacroCard ✅ live · NewsCard ✅ live · EventBanner stillgelegt
- **Alle 5 Cover-Cards live** — der Phase-5-Hauptzweck ist materiell erreicht. 5.4 ist nur noch Polish + Abschluss-Hygiene.

### Files dieser Session
- `src/lib/macroEventsResolver.ts` (getNaechsteWichtigeEvents)
- `src/lib/newsResolver.ts` (Quelle gewechselt)
- `src/data/news-voll.json` (cover_headlines + Schema-Doku)
- `src/components/MacroCard.astro` (komplett neu · 3er-Vorausschau)
- `src/components/KalenderCard.astro` (komplett neu · defensive Wochen-Strip)
- `src/components/EventBanner.astro` (Header-Kommentar Stilllegung)
- `src/pages/index.astro` (Promise.all + Banner ausgebunden)
- 7 Stub-Files gelöscht (kalenderResolver, kalender.json, macroResolver, macro.json, eventResolver, events.json, news.json)
- `docs/PHASE-5-COVER-SYNC-SPEC.md` (§2 Status · §3 Card-Tabelle · §4.3/4.4/4.5/4.6 Realitäts-Boxen · §5 Mario-Entscheidungen erweitert)
- `_pendenzen.md` (Slice 5.3 ✅, 5.4 als letzter Schritt)
- `SESSION_LOG.md` (Update 37)
- `docs/HANDOVER.md` (Stand nach 5.3 · 5.4 als letzter Slice)

---

## 26-05-14 (Update 36) · Phase 5 · Slice 5.2b · WetterCard Live-Swap · Slice 5.2 abgeschlossen

### Was gemacht
- `src/lib/astronomieResolver.ts` · `blaue_stunde.ende` von `dusk` auf `nauticalDusk` umgestellt (Mario-Entscheidung in 5.2b · siehe unten)
- `src/pages/index.astro` · Promise.all um `getWetterErgebnis()` erweitert · synchron danach `stunden = getStundenHeute()` + `foto = getFotoEmpfehlung(wetter.heute)` · WetterCard erhält Props
- `src/components/WetterCard.astro` · Live-Swap:
  - Inline-SonneWolken-SVG (byte-genau Duplikat zu `SonneWolken.astro`) **entfernt** → `<WetterSymbol wmoCode={wetter.heute.wmo_code} size={64} />`
  - Props-Interface `{ wetter: WetterErgebnis; stunden: StundenHeute; foto: FotoEmpfehlung }` · Card liest nicht mehr selbst (Pattern wie KryptoCard in 5.1)
  - Live-Stempel im `card-head`-Flex-Container · `Live · {fetch_zeit}` / `Fallback · Open-Meteo offline`
  - Stunden-Formatierung in der Card (View-Logik): `{start} — {ende}` mit Em-Dash U+2014 + Leerzeichen
  - Foto-Hinweis: `{foto.begruendung}` direkt (FotoEmpfehlung liefert fertigen Satz mit Punkt)
  - Wind-Format: `{wind_richtung} {wind_kmh} km/h`
  - Obsolete `.wetter-symbol`-CSS-Klasse entfernt
  - `niederschlag_mm` bewusst nicht angezeigt · Layout-Treue · WetterDetail auf /wetter zeigt es weiterhin
- Stub-Files gelöscht: `src/lib/wetterPicker.ts` + `src/data/wetter.json`

### Mario-Entscheidung Blaue-Stunde-Definition: nauticalDusk
In 5.2a war provisorisch `sunset → dusk` (bürgerliche Dämmerung, ≈ 36 min) gewählt mit Vermerk "Mario kann später anpassen". Mario hat in der 5.2b-Freigabe entschieden: **erweitertes fotografisches Fenster** `sunset → nauticalDusk` (Sonne 12° unter Horizont, ≈ 82 min). Begründung: Card ist Inspirations-Werkzeug, nicht Timing-Anker. Touch im astronomieResolver mit getStundenHeute() · gehört in DENSELBEN feat-Commit (Mario-GO).

### Sanity-Check nauticalDusk · gegen unabhängige Quelle (nicht zirkulär)
Vor dem Code-Touch: Erwartungswert unabhängig bestimmt via `api.sunrise-sunset.org`:
- nautical_twilight_end Baden 14.5.2026 = 22:18 CEST

Nach dem Code-Touch: SunCalc-Output gemessen:
- SunCalc.nauticalDusk Baden 14.5.2026 = 22:19 CEST

Drift: 1 min · normaler Implementations-Drift zwischen astronomischen Bibliotheken (atmosphärische Brechungs-Modelle). Plausibel · gleiche Größenordnung wie 5.2a-Check.

### Mobile-Layout-Befund (Notiz 1 aus GO)
Auf 375px wrappt der `card-head` Eyebrow + Live-Stempel je auf zwei Zeilen:
- Eyebrow: "WETTER & FOTO · BADEN" / "AG"
- Stempel: "LIVE · 22:51" / "CEST"

Funktional ok (kein Overlap, kein Abschneiden), optisch sichtbar eng. **Bewusst nicht in 5.2b umdesignt** — Mario sagte "im Bericht melden, nicht selbst umdesignen". Slice 5.4 (Polish/Volltest) ist der Ort, falls Mario Anpassung will (z.B. Wrapping-Logik oder kompakteres Stempel-Format). In Spec §4.2 festgehalten.

### niederschlag_mm-Auslassung (Notiz 2 aus GO)
In Spec §4.2 als bewusste Layout-Treue-Entscheidung festgehalten: Wert ist in `WetterErgebnis.heute.niederschlag_mm` verfügbar, WetterDetail auf /wetter zeigt ihn (conditional `> 0`). Cover-Card zeigt ihn nicht, weil Phase-2.2-Stub-Layout kein Slot dafür hat. Falls Cover-Card jemals Niederschlag mitzeigen soll: dedizierte Mario-Entscheidung + Layout-Anpassung.

### Verifikation
- `npm run build` grün
- Dev-Server-Restart (HMR-Falle)
- Lokal /-Cover: WetterCard zeigt `6° · Vorwiegend klar · S 3 km/h · Goldene 20:11 — 20:56 · Blaue 20:56 — 22:19 · "Klarer Abend · goldene Stunde ideal für Architektur-Spots." · Live · 22:51 CEST`
- KryptoCard weiterhin live (5.1), andere Cards weiter Stub — erwartet
- Light + Dark sauber
- Mobile 375px Befund (siehe oben)
- /wetter Sicherheits-Check: WetterDetail visuell unverändert
- Console clean
- Production nach Push: live mit denselben Werten · Stempel `Live · 22:52 CEST`

**Stolperstein erweitert (HANDOVER §5):** Auch zwischen `until curl -sf` (das nur Status-200 prüft) und dem Inhalts-curl kann der Edge-Cache noch alte Werte serve-en. Erster Inhalts-curl direkt nach Deploy-Ready erwischte teilweise alte Stub-Werte, zweiter sauber. Lehre: Status-200 ≠ Inhalts-Propagation, eventuell 2–3 Sekunden warten oder mehrfach versuchen.

### Cover-Stand nach Slice 5.2
- KryptoCard ✅ live (Slice 5.1)
- WetterCard ✅ live (Slice 5.2)
- KalenderCard: Stub (kommt in 5.3)
- MacroCard: Stub (kommt in 5.3)
- NewsCard: Stub (kommt in 5.3)
- EventBanner: Stub (kommt in 5.3)

### Files dieser Session
- `src/lib/astronomieResolver.ts` (blaue_stunde.ende → nauticalDusk + Kommentar-Update)
- `src/pages/index.astro` (Promise.all-Erweiterung + WetterCard-Props)
- `src/components/WetterCard.astro` (Live-Swap, Inline-SVG entfernt, card-head-Pattern, Stunden-Formatierung)
- `src/lib/wetterPicker.ts` (gelöscht)
- `src/data/wetter.json` (gelöscht)
- `docs/PHASE-5-COVER-SYNC-SPEC.md` (§2 Status · §3 Card-Status-Tabelle · §4.2 Realitäts-Box mit nauticalDusk-Korrektur + niederschlag-Auslassung + Mobile-Befund)
- `_pendenzen.md` (Phase 5 Status · Slice 5.2 ✅ · 5.3 als Nächstes)
- `SESSION_LOG.md` (Update 36)
- `docs/HANDOVER.md` (Stand nach 5.2 · 5.3 als nächster Schritt)

---

## 26-05-14 (Update 35) · Phase 5 · Slice 5.2a · getStundenHeute()

### Plan-First-Befund · offen festgehalten
Original-Slice-5.2-Plan sah einen `wmoSymbol.ts`-Helper + `WetterDetail.astro`-Refactor vor unter Verweis auf "Refactor-Schuld aus 2.3.3". Mario hat das so im GO-Prompt formuliert.

**Befund nach Bestandsaufnahme (Plan-First):** Die vermutete Schuld existiert nicht in der angenommenen Form. `WetterSymbol.astro` ist bereits seit Phase 2.3 zentralisiert (`src/components/wetter-symbole/WetterSymbol.astro` mit eigener `symbolFor()`-Mapping-Funktion, 8 SVG-Sub-Komponenten daneben). WetterDetail nutzt diesen Wrapper bereits an zwei Stellen (Heute-Hero size=96 + 7-Tage-Strip size=32).

**Echte Lokalisation der Duplikation:** Die Cover-`WetterCard.astro` (Stub) hat das `SonneWolken`-SVG **byte-genau inline dupliziert** — gleicher viewBox, gleicher d-Pfad, gleiche Sonnen-Geometrie, gleiche `fill="var(--bg-card)"`-Wolke. Diese Duplikation gehört aber in 5.2b (Card-Swap nutzt dann den Wrapper direkt).

**Konsequenz:** Mario hat die Klärung "Wrapper reicht für 5.2b oder Roh-String nötig?" konkret entschieden — Wrapper reicht. Damit entfällt `wmoSymbol.ts` komplett. **5.2a schrumpft auf nur `getStundenHeute()`** — kleinerer sauberer Slice, keine tote Helper-Datei.

### Bau-Aufteilung 5.2a / 5.2b
Phase 5 hat weiterhin 4 Slices (5.1/5.2/5.3/5.4). 5.2 ist intern in **5.2a + 5.2b** geteilt — analog zum 4.5b/4.5c-Pattern (Bau-Aufteilung innerhalb EINES Slices, nicht neue Phasen-Nummer). In Spec §2 und §4.2 dokumentiert.

### Was gemacht (Slice 5.2a)
- `src/lib/astronomieResolver.ts` · neue Funktion `getStundenHeute(datum?: Date)` mit Interface `StundenHeute`
- Goldene Stunde: `SunCalc.goldenHour` → `sunset` (≈ 45 min Range)
- Blaue Stunde: `SunCalc.sunset` → `SunCalc.dusk` (Ende bürgerliche Dämmerung)
- Bestehende `getAstronomieHeute()` und alle anderen Funktionen/Interfaces unverändert
- Nutzt vorhandene `LAT`/`LNG`-Konstanten + `formatZeit()`-Helper im Resolver

### Sanity-Check · gegen unabhängige Quelle (Spec-Notiz 2)
Nicht zirkulär gegen die eigene SunCalc-Annahme geprüft, sondern gegen `api.sunrise-sunset.org` (freie Public API):

| Wert | SunCalc-Code | sunrise-sunset.org | Drift |
|---|---|---|---|
| sunset Baden 14.5. | 20:56 CEST | 20:57 CEST | 1 min |
| Ende Blaue Stunde (dusk / civil_twilight_end) | 21:32 CEST | 21:31 CEST | 1 min |
| Start Goldene Stunde (45 min vor sunset) | 20:11 CEST | (kein Wert) | — |

1-min-Differenz ist normaler Implementations-Drift zwischen astronomischen Bibliotheken (unterschiedliche Modelle für atmosphärische Brechung). Werte plausibel.

### Blaue-Stunde-Definition · Spec-Notiz 1
`blaue_stunde` = `sunset` → `dusk` (bürgerliche Dämmerung, Sonne 6° unter Horizont) ist eine fotografisch verteidigbare Definition, nicht die einzige. Alternative wäre bis `nauticalDusk` (Sonne 12° unter Horizont, längere "blaue" Phase). In Spec §4.2 explizit festgehalten — Mario kann das in 5.2b oder später anpassen wenn die Card auf der echten Seite nicht passt.

### Verifikation
- `npm run build` grün
- Dev-Server-Restart (HMR-Falle nach Resolver-Edit)
- /wetter Light: visuell unverändert (kein Code dort berührt — nur Add-Only-Edit in astronomieResolver)
- Console clean
- Kein Production-Check (5.2a ändert nichts Cover-sichtbar)

### Files dieser Session
- `src/lib/astronomieResolver.ts` (+27 Zeilen · StundenHeute-Interface + getStundenHeute-Funktion)
- `docs/PHASE-5-COVER-SYNC-SPEC.md` (§2 Slice-Status · §4.2 Realitäts-Box + Blaue-Stunde-Definition + Sanity-Check-Quelle)
- `_pendenzen.md` (5.2a ✅ · 5.2b als nächstes · Bau-Aufteilung-Hinweis)
- `SESSION_LOG.md` (Update 35)
- `docs/HANDOVER.md` (Stand nach 5.2a · 5.2b als nächster Schritt)

---

## 26-05-14 (Update 34) · Phase 5 · Slice 5.1 · SSR-Foundation + KryptoCard live

### Phase-5-Eröffnung · Cover-Sync
Phase 4 ist abgeschlossen, das HQ-MVP steht funktional auf /wirtschaft + /wetter. Phase 5 zieht das Cover (/) nach: alle Daten-Cards von statischen JSON-Stubs auf Live-Quellen umstellen. Bewusst alle Cards in einem Vorhaben, kein Halb-Zustand. Krypto-Card nutzt NUR CoinGecko (keine Trading-Indikatoren · würde IP-Block des Phase-4-Nachläufers vererben).

Phase 5 = **4 Slices total** (5.1 Krypto, 5.2 Wetter, 5.3 Kalender+Macro+News+EventBanner, 5.4 Polish/Abschluss). Spec: `docs/PHASE-5-COVER-SYNC-SPEC.md`.

### Slice-Nummerierungs-Klärung
Die frühere Bezeichnung *"Slice 5.1 Binance/Bybit-Swap"* (Commits `91ef169` + `7de6592`, 14.5.) war ein Übergangs-Label am Ende von Phase 4. Phase 5 startet die Slice-Zählung neu mit 5.1, 5.2, 5.3, 5.4. Commits aus dem Phase-4-Nachläufer bleiben unverändert (Git-Geschichte ist unveränderlich), wir referenzieren sie weiterhin per SHA. Klärung in `_pendenzen.md`, `docs/PHASE-5-COVER-SYNC-SPEC.md` §9 und diesem SESSION_LOG-Eintrag einmal festgehalten.

### Was gemacht (Slice 5.1)
- `docs/PHASE-5-COVER-SYNC-SPEC.md` neu · §1 Ziel · §2 4-Slice-Reihenfolge mit Begründung · §3 Card-Live-Status-Tabelle · §4 Cards im Detail · §5 Mario-Entscheidungen · §6 Risiken (inkl. CoinGecko-Cache-Verhalten als dauerhaftes Cover-Pattern) · §7 Anti-Patterns · §8 Spec-Sync-Konvention · §9 Slice-Nummerierungs-Klärung
- `src/pages/index.astro` SSR-Foundation: `export const prerender = false` · Cache-Header `s-maxage=60, stale-while-revalidate=300` analog /wirtschaft · `Promise.all` für parallele Fetches (`getKryptoStand` + `getFearGreed`)
- `src/components/KryptoCard.astro` von Stub auf Live umgestellt: Props-Interface `{ krypto, fearGreed }`, BTC via `coins.find(c => c.symbol === 'BTC')` defensiv, Live-Stempel-Pattern, F&G-Fallback-Zeile `— · F&G —`, neue CSS-Regel `.live-stempel.offline` für Vermillon
- `src/lib/kryptoResolver.ts` und `src/data/krypto.json` gelöscht
- EventBanner bleibt **bewusst** auf eventResolver-Stub bis 5.3 (sauberer Übergang · explizit in Spec §4.6 dokumentiert)

### Mario-Entscheidungen (Phase-5-Eröffnung)
- **Macro-Indizes:** A · weglassen (statische Lüge auf Startseite ist worse than Schweigen)
- **NewsCard-Quelle:** B · `cover_headlines` in `news-voll.json`, `news.json` löschen (Single-Source, Mario-Kuratierung bleibt)
- **EventBanner-Trigger:** in 5.3 nach Event-Zählung entscheiden (datenabhängig)
- **Spec-Anlage:** als erster Task in Slice 5.1, kein separater Vor-Slice

### Mario-Doku-Schulden in diesem docs-Commit mit aufgeräumt
- **Vercel-Doppel-Projekt** nach "Erledigt" (heute von Mario bereinigt, ältere `mario-hq`-Instanz gelöscht, nur noch `mario-hq-qc6f` aktiv)
- **Custom-Domain-Notiz korrigiert:** KEINES der beiden Projekte hatte je eine Custom Domain (frühere Notiz "qc6f hat die Custom Domain" war falsch). Custom Domain steht weiter aus (Phase 6).

### Verifikation
- `npm run build` grün · `/index.html` nicht mehr in prerendering-Liste (SSR-Switch erfolgreich)
- Dev-Server-Restart nach Komponenten-Edits (HMR-Falle)
- Lokal /-Cover: KryptoCard zeigt live `$81'422 · BTC · 24h +2.4% · Fear · F&G 34 · Live · 21:47 CEST`
- Light + Dark + Mobile 375px sauber, Console clean
- Production-Check nach Push: live `$81'432 · +2.3% · Fear · F&G 34 · Live · 22:02 CEST`
- **Stolperstein dokumentiert:** Erster Production-curl mit `?cb=$(date +%s)` (Sekunden-Resolution) traf Vercel-Edge-Cache des alten Builds — Werte sahen aus wie Stub. Zweiter curl mit `?bust=$(date +%s%N)` (Nanosekunden) lieferte sauber den neuen SSR-Output. Bei künftigen Production-Tests: Nanosekunden-Bust verwenden oder mehrfach reloaden.

### Cover-Stand nach 5.1
- KryptoCard: ✅ live (CoinGecko + Fear & Greed)
- WetterCard: Stub (kommt in 5.2)
- KalenderCard: Stub (kommt in 5.3)
- MacroCard: Stub (kommt in 5.3)
- NewsCard: Stub (kommt in 5.3)
- EventBanner: Stub (kommt in 5.3, sauberer Übergang)

### Files dieser Session
- `docs/PHASE-5-COVER-SYNC-SPEC.md` (neu)
- `src/pages/index.astro` (SSR-Foundation)
- `src/components/KryptoCard.astro` (Live)
- `src/lib/kryptoResolver.ts` (gelöscht)
- `src/data/krypto.json` (gelöscht)
- `_pendenzen.md` (Phase 5 in Arbeit · Slice-Nummerierung geklärt · Doppel-Projekt nach Erledigt · Custom-Domain-Korrektur)
- `SESSION_LOG.md` (Update 34)
- `docs/HANDOVER.md` (Stand nach Phase 5 Slice 5.1)

---

## 26-05-14 (Update 33) · Slice 5.1 · Bybit-Swap · Teil-Slice / eskaliert

### Wette und Befund
Slice 5.1 war ein bewusster Schnell-Fix-Versuch: Binance Public API ist von Vercel-Lambda-IPs geblockt (entdeckt 13.5.), 4 Trading-Indikator-Cards zeigen Fallback auf Production. Hypothese: Bybit V5 hat lockerere Geo-Restriktionen und liegt im selben Datenmodell-Schema. Risiko #1 im Plan explizit benannt: **"Vercel-IP-Block bei Bybit unbestätigt — Garantie gibt es erst nach Production-Deploy."**

Wette verloren. Risiko #1 ist materialisiert.

**Befund nach Production-Deploy von `91ef169`:**
- Bybit Funding / Open Interest / Long-Short Ratio · alle 3 Cards Fallback
- Coinbase Premium (nutzt Bybit-Spot für Vergleich) · Fallback (vergleichs_preis=0, coinbase_preis=0)
- DeFiLlama Stablecoin Supply · **läuft weiter live**
- CoinGecko BTC Hero + Krypto-Sektion · **läuft weiter live**

Stablecoin und CoinGecko sind der entscheidende Beleg: **kein generisches Vercel-Netzwerk-Problem**, sondern **anbieter-klassen-spezifischer Block**. Derivate-Börsen (Binance Futures, Bybit V5) blocken US-Datacenter-IP-Ranges; Stablecoin-/Markt-Daten-APIs (DeFiLlama, CoinGecko, Alternative.me, Coinbase Exchange Rates) tun das nicht.

**Routing-Beweis:** Vercel-Header `x-vercel-id: fra1::iad1::...` — `fra1` ist die deploy-Region (Frankfurt-CDN), `iad1` ist die ausführende Lambda-Region (US-AWS, Northern Virginia). Die Bybit/Binance-Blocks zielen auf genau diese US-Datacenter-IP-Ranges wegen US-CFTC/Treasury-Compliance.

Damit ist der vorherige "Wahrscheinlich-Befund" zum **strukturellen Befund** geworden: Anbieter-Swap im selben Anbieter-Klassen-Pool wird nicht funktionieren. OKX wurde bewusst nicht getestet — gleiche Compliance-Klasse, gleiches Risiko.

### Was gebaut wurde (bleibt auf main)
- `git mv` binanceFetcher.ts → bybitFetcher.ts + komplettes Rewrite (Bybit V5 Public)
- `BinanceErgebnis` → `BybitErgebnis`, alle Typen + Imports gezogen
- coinbasePremiumFetcher: `binance_preis` → `vergleichs_preis` (generisch, kein Interface-Rename beim nächsten Anbieter-Wechsel) · Spot-Endpoint auf Bybit
- L/S-Ratio: `ratio = buyRatio / sellRatio` (Bybit liefert Komponenten getrennt)
- OI + L/S: `[...list].reverse()` für chronologische Sparkline (Bybit liefert neueste-zuerst)
- 4 UI-Wahrheits-Korrekturen: Eyebrows "BINANCE" → "BYBIT" in 3 Trading-Cards + Quellen-Label in CoinbasePremiumCard
- sources.json: Binance Futures → Bybit V5 Public

### Periodizität pro Card · 1:1 zu Binance-Vorläufer
- Funding: limit=1 Einzelwert (Card hat keine Sparkline)
- OI: intervalTime=1h, limit=24 → 24h-Fenster
- L/S: period=5min, limit=24 → 2h-Fenster
- Coinbase-Premium: Spot-Einzelwert

Alle 1:1 abgeglichen vor dem Swap — verhindert stille Daten-Lüge mit gleichgrosser Sparkline aber anderem Zeitraum.

### Lokale Verifikation (vor Push)
- Build grün
- /wirtschaft Light: alle 4 Cards LIVE (Funding -0.0000% BTC · +0.0041% ETH · -0.0074% SOL · OI 51'865 BTC · L/S 0.89 BTC · 2.31 ETH EXTREME · Premium +0.030% Neutral · BYBIT $81'824 / COINBASE $81'848)
- Dark + Mobile 375px sauber
- Console clean
- HMR-Falle vermieden: Dev-Server vorher gestoppt, frisch gestartet

### Strategische Konsequenz: Anbieter-Swap-Pfad erschöpft
Verbleibender Lösungs-Pfad: **nur noch Architektur · Fetch-und-ablegen.** Externer Job aus einer kontrollierten IP holt die Daten, schreibt in Storage, Page rendert daraus.

**GEPARKT mit neuem Trigger:** "Mario nutzt /wirtschaft regelmässig auf Production/Mobile und will die 4 Cards dort live." Alter Trigger ("nächster Anbieter blockt auch") ist verbraucht.

**Cheap-Schritt-1 vor jedem Pipeline-Bau:** verifizieren ob ein GitHub-Actions-Runner (Azure-IP) Bybit oder Binance überhaupt erreicht. Wenn nein → Residential-IP-Lösung nötig (eigener Mini-Server, Cloudflare Tunnel, oder bezahlter Proxy). Das ist ein deutlich grösserer Architektur-Schritt — vor dem Bauen klären.

### UI-Stand nach 5.1 (akzeptiert)
Die 4 Cards zeigen weiterhin Fallback auf Production. Funktional identisch zum Stand vor 5.1. **Aber UI-Wahrheit ist korrekt:** "Fallback · Bybit offline" stimmt mit dem aktuellen Fetcher-Code überein, nicht mehr "Binance offline" wo Bybit gemeint wäre. Beim nächsten Versuch (mit Architektur-Lösung oder anderem Anbieter) ist der Rewrite-Pfad sauber vorbereitet (generic Feldnamen, klar getrennte Typen).

### Kein Revert
Bewusste Entscheidung: 91ef169 bleibt. Begründungen:
- Bybit-Code ist korrekt gebaut und läuft lokal
- "Fallback · Bybit offline" ist ehrlicher als "Fallback · Binance offline" (Quelle stimmt mit Fetcher überein)
- Beim nächsten Slice (egal welcher Pfad) ist die Vorarbeit weiter nutzbar — keine doppelte Arbeit

### Files dieser Session
- `src/lib/bybitFetcher.ts` (neu via git mv + rewrite)
- `src/lib/coinbasePremiumFetcher.ts` (Bybit-Spot + vergleichs_preis)
- `src/components/wirtschaft/TradingIndikatoren.astro` (Typ + Prop-Rename)
- `src/components/wirtschaft/FundingRatesCard.astro` (Import + Eyebrow + Stempel)
- `src/components/wirtschaft/OpenInterestCard.astro` (dito)
- `src/components/wirtschaft/LongShortRatioCard.astro` (dito)
- `src/components/wirtschaft/CoinbasePremiumCard.astro` (Import via dependency · Label + Feld)
- `src/pages/wirtschaft.astro` (Import + Funktionsname)
- `src/data/sources.json` (Binance → Bybit)
- `_pendenzen.md` (Production-Issue umgeschrieben zu strukturellem Befund · 5.1 als Teil-Slice/eskaliert)
- `SESSION_LOG.md` (Update 33)
- `docs/HANDOVER.md` (Stand nach 5.1 · Architektur-Frage als nächstes strategisches Thema)

---

## 26-05-14 (Update 32) · Slice 4.8 · Polish + Phase-4-Abschluss

### Was gemacht
- `src/components/CoverFooter.astro` · "Phase 2.2" → "Phase 4" (Cover-Stempel-Fix, in 4.5-Footer-Fix nicht erfasst weil andere Quelle)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` · §7.7-Realitäts-Box (faktisch korrekt nach macro-events.json und MacroTimeline.astro) · §5 macroEventsResolver.ts nachgetragen · §6 Slice 4.8 ✅ · Frontmatter status = ABGESCHLOSSEN
- `_pendenzen.md` · Phase 4 als abgeschlossen markiert · Duplikat-Einträge (Z.140-141) bereinigt · Cover-Stempel-TODO erledigt · Slice 4.8 ✅
- `docs/HANDOVER.md` · Rewrite für Phase-5-Übergang

### Volltest Light / Dark / Mobile 375px
- **/wirtschaft Light:** BTC-Hero + Sparkline ✅ · Trading-Indikatoren (5 Cards, live Binance) ✅ · KryptoSektion Block 1+2 (alle Sparklines) ✅ · AktienSektion + ForexSektion TWELVE DATA OFFLINE (erwartet lokal, kein Edge-Cache) ✅ · MacroTimeline 9 Events ✅ · FearGreedGauge 34 "Fear" ✅ · News + TradeSetups + Quellen ✅
- **/wirtschaft Dark:** ECharts-Farben (Sparklines, FearGreedGauge) live Theme-Switch ✅ · alle Sektionen korrekt ✅
- **/wirtschaft Mobile 375px:** MacroTimeline zweizeilig (Datum+Uhrzeit / Name) ✅ · FearGreedGauge rendert ✅ · Krypto-Cards ohne Sparklines (Desktop-only) ✅
- **/wetter Light:** WetterDetail ✅ · WetterWochenBars (7 Floating-Bars, Fr–Do) ✅ · MondphaseSvg (Abnehmende Sichel 6%) ✅ · FotoSpots ✅
- **/wetter Dark:** WetterWochenBars weiß auf dunkel ✅ · MondphaseSvg lesbar ✅
- **/wetter Mobile 375px:** WetterWochenBars skaliert sauber · Spots gestapelt ✅
- **Console:** 0 Errors auf beiden Pages ✅

### Keine visuellen Issues gefunden

### Phase-4-Synthese · alle Slices + Kernerkenntnisse

**Phase 4 (Charts + Trading-Watchlist) · 14.5.2026 · 8 Slices + 3 Zwischen-Slices + 1 Spec-Sync:**

| Slice | Kernarbeit | Kernentscheid |
|---|---|---|
| 4.1 | ECharts-Foundation + DRG-Theme + BTC-Hero mit Sparkline | client:visible-Island-Pattern für alle ECharts-Komponenten |
| 4.2 | 5 Trading-Indikatoren-Cards · Binance/Coinbase/DeFiLlama | Binance auf Production geblockt (Production-Issue 5.1, offen) |
| 4.3 | Multi-Anbieter-Watchlist-Foundation · twelveDataFetcher · watchlist.json | 8-Credits/min-Limit erst in 4.5 entdeckt — Architektur in 4.5 erzwungen |
| 4.4 | Watchlist-Komponenten mit Gruppierung · Crypto-Items · Mini-Sparklines | Zeilen-Liste (4.4) → Card-Grid (4.5b) |
| 4.5 | Aktien + Forex · Endpoint-Architektur wegen 8/min-Limit | Zwei separate Endpoints mit TTL-Versatz (1200s / 1320s) + SWR · Commodities komplett raus (WTI/GOLD matchen falsche NYSE-Aktien) |
| 4.5b | Krypto-Card-Rebuild · gemeinsame AssetCard · KryptoSektion (Rename) | Sichtbarer IA-Umbau in eigenem Slice |
| 4.5c | kryptoAggregator (rename + -30% Code-Reduktion) | Unsichtbarer Refactor bewusst getrennt von 4.5b |
| Spec-Sync | Phase-4-Spec an Realität nach 4.5b/c angeglichen | Eyebrow "WATCHLIST" → "MÄRKTE" |
| 4.6 | WetterWochenBars (ECharts Floating-Bars) + MondphaseSvg (Custom-SVG, k=1-2*f-Geometrie) | Mondphase: mathematische Pfad-Geometrie vor Code festnageln (SVG-Sweep-Flags kippen zwischen Sichel und Gibbous) |
| 4.7 | MacroTimeline (Editorial-Liste) + FearGreedGauge (ECharts) + 9 echte Events | MacroTimeline: Liste statt ECharts-Zeitachse (Label-Kollisionen) — explizit genehmigt |
| 4.8 | Polish · Volltest · Spec-Sync §7.7 · Cover-Stempel · Phase-4-Abschluss-Doku | — |

**Bewährte Pattern Phase 4:**
- Spec-First + Plan-First + Slice-Pattern (feat+docs)
- Sichtbare vs. unsichtbare Änderungen trennen (4.5b vs. 4.5c)
- Live-API vor Code testen (Twelve Data: 8/min-Limit, WTI/GOLD-Ambiguität)
- Spec-Abweichung mit Begründung erlaubt — in Spec-Realitäts-Box dokumentieren
- ECharts-Quirk: `title: { show: false }` explizit für Gauges (sonst doppeltes Label)

**Offene Production-Issues nach Phase 4:**
- 5.1 · Vercel blockt Binance-API → 4 Trading-Indikatoren-Cards Fallback auf Production
- 5.2 · Vercel-Doppel-Projekt (`mario-hq` + `mario-hq-qc6f`) → eines löschen

### Files dieser Session
- `src/components/CoverFooter.astro` (Phase-4-Stempel)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` (§7.7-Box + §5 + §6 + Frontmatter)
- `_pendenzen.md` (Phase-4-Abschluss + Duplikat-Bereinigung)
- `SESSION_LOG.md` (Update 32)
- `docs/HANDOVER.md` (Post-4.8-Rewrite)

---

## 26-05-14 (Update 31) · Slice 4.7 · Macro-Timeline + Fear & Greed Gauge

### Was gemacht
- `src/data/macro-events.json` (neu) · 9 echte Macro-Events 14.5.-28.5.2026 · via Fed/ECB/SNB/BEA/TradingEconomics verifiziert · Schema-Doku inline (`_schema_doku`) damit Mario die JSON künftig manuell pflegen kann
- `src/lib/macroEventsResolver.ts` (neu) · liest JSON, filtert auf 14-Tage-Fenster ab heute, sortiert nach Datum+Uhrzeit
- `src/lib/fearGreedFetcher.ts` (neu) · alternative.me-Fetcher · **1h Module-Cache** (Spec-konform) · defensive Behandlung wie defiLlama · Fehler werden NICHT gecached (nächster Hit retry)
- `src/components/wirtschaft/MacroTimeline.astro` (neu) · Editorial-Liste · Datum/Uhrzeit/Name/Impact-Farbpunkt · heute mit Vermillon-Balken links · zweizeiliges Mobile-Layout
- `src/components/wirtschaft/FearGreedGauge.astro` (neu) · ECharts-Halbkreis-Tachometer · Wert in Fraunces 36px · Label in Mono · KEIN Grün · Astro-Islands
- `src/lib/echartsRenderer.ts` · `initFearGreedGauge` mit Achsen-Farbverlauf Vermillon (0-30 Fear-Zone) → neutral (30-100) · `title: { show: false }` explizit (sonst rendert ECharts data.name doppelt zum HTML-Label)
- `src/pages/wirtschaft.astro` · MacroTimeline + FearGreedGauge nach ForexCommoditiesSektion · getFearGreed im Promise.all · macroEvents synchron via Resolver
- `src/data/sources.json` · Alternative.me + Macro-Kalender (kuratiert) als neue Quellen

### Macro-Event-Recherche · was im Fenster liegt UND was nicht
Verifiziert über offizielle Quellen:
- **Im Fenster (14.5.-28.5.2026):** US Retail Sales (14.5.), CA CPI (19.5.), UK CPI (20.5.), US FOMC Minutes (20.5.), US Housing Starts (21.5.), UK Retail (22.5.), DE Ifo (22.5.), US BIP Q1 2. Schätzung (28.5.), **US PCE Preisindex April (28.5.) als kritisch** — Fed's bevorzugter Inflations-Indikator
- **NICHT im Fenster:** FOMC erst 16-17.6., EZB-Zinsentscheid 10-11.6., SNB erst 18.6. — alle Zentralbank-Entscheidungen liegen erst im Juni. Bewusst transparent gemacht.
- **Bewusst weggelassen:** China-Daten (für Krypto-Trader nicht primär), Trump-Xi-Summit 15.5. (geopolitisch, kein Daten-Release)

### Darstellungs-Entscheidung MacroTimeline: Liste statt ECharts-Zeitachse
Bewusst von Spec §7.7 ("horizontale Zeitachse mit Punkten") abgewichen. Begründung:
- 9 Events mit Häufungen (3 am 20.5., 2 am 22.5., 2 am 28.5.) → ECharts-Achse hätte Label-Kollisionen produziert
- Auf Mobile 375px wäre die Zeitachse unlesbar
- Editorial-Liste erfüllt die semantische Aufgabe (chronologische Reihenfolge + Impact-Codierung via Farbpunkt) auf jedem Viewport robust
- Bonus: keine ECharts-Komponente nötig → statisches SSR-Rendering, kein Astro-Islands-Setup

Mario hat diese Abweichung explizit freigegeben mit der Auflage: Realitäts-Notiz beim nächsten Spec-Sync oder im 4.8-Polish in Spec §7.7 ergänzen. Vormerkung steht in `_pendenzen.md` Slice 4.8.

### FearGreed-Cache: 1h Module-Cache (Mario-Präzisierung)
Erst-Plan hatte "1h-Cache nicht erzwingen, 60s-Page-Cache reicht eh". Mario hat das auf 1h-Cache spec-konform präzisiert · Begründung: Wert ändert sich täglich, nicht minütlich · Konsistenz mit Spec schlägt Pragmatik wenn die Spec richtig liegt. In-Memory-Module-Cache mit `expires`-Timestamp + Cache-Hit-Check vor jedem Fetch · Fehler werden NICHT gecached (kein Vergiften).

### Verifikation
- Build ✅ lokal
- /wirtschaft lokal: 9 Macro-Events in chronologischer Liste, heute (14.5.) mit Vermillon-Balken links, PCE (28.5.) mit Vermillon-Punkt; F&G-Gauge zeigt Wert 34 "Fear", Vermillon-Achsen-Segment 0-30, Nadel auf 34
- F&G-Layout-Fix während Verifikation: doppeltes "Fear"-Label entfernt (`title: { show: false }` in ECharts-Option), Werte-Layout vom margin-top:-56px auf normales Stack unter Gauge umgestellt
- Light/Dark/Mobile 375px alle sauber: Mobile zeigt zweizeilige Event-Zeilen (Datum/Uhrzeit oben, Name unten, Punkt links)
- Console clean nach Dev-Restart
- Vercel-Push grün · /wirtschaft-Verifikation steht aus (docs-Commit-Push)

### Files dieser Session
- `src/data/macro-events.json` (neu, 9 Events + Schema-Doku)
- `src/lib/macroEventsResolver.ts` (neu)
- `src/lib/fearGreedFetcher.ts` (neu, 1h Module-Cache)
- `src/components/wirtschaft/MacroTimeline.astro` (neu)
- `src/components/wirtschaft/FearGreedGauge.astro` (neu)
- `src/lib/echartsRenderer.ts` (initFearGreedGauge ergänzt)
- `src/pages/wirtschaft.astro` (Integration)
- `src/data/sources.json` (alternative.me + macro-kalender)
- `_pendenzen.md` (4.7 ✅, 4.8 als nächstes mit §7.7-Realitäts-Notiz-Vormerkung)
- `SESSION_LOG.md` (Update 31)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §6 (4.7 ✅)
- `docs/HANDOVER.md` (Stand nach 4.7 · Slice 4.8 als Abschluss)

---

## 26-05-14 (Update 30) · Slice 4.6 · Wetter-Wochen-Bars + Mondphase-SVG

### Was gemacht
- `src/components/wetter/WetterWochenBars.astro` (neu): ECharts vertikale Floating-Bars · Min/Max-Temperatur über 7 Tage · X-Achse Wochentage (Mo-So), Y-Achse °C-Werte · Höhe 120px · DRG-Theme zwingend, keine Tooltips · Astro-Islands mit IntersectionObserver
- `src/components/wetter/MondphaseSvg.astro` (neu): Custom-SVG 60×60px · sumi-e-Reduktion · Konturkreis + Schatten-Kreis + beleuchteter Pfad mit zwei Bögen
- `src/lib/echartsRenderer.ts`: `initWetterWochenBars(el, daten)` neu · Floating-Bar-Trick mit zwei stacked series (transparenter Sockel + sichtbare Range) · MutationObserver für Live-Theme-Switch · ResizeObserver
- `src/lib/astronomieResolver.ts`: `Mondphase`-Interface um `ist_zunehmend: boolean` erweitert · intern bereits als `isWaxing = moonIllum.phase < 0.5` berechnet, jetzt auch nach aussen exportiert · 2-Zeilen-Änderung · keine Breaking Change (bestehender Caller AstronomieSektion nutzte das Feld nicht)
- `src/components/wetter/AstronomieSektion.astro`: MondphaseSvg in `mondphase-card` eingebaut (SVG links, Text rechts) · neue CSS-Klassen `mondphase-head` / `mondphase-text`
- `src/pages/wetter.astro`: `<WetterWochenBars>` zwischen `<WetterDetail>` und `<AstronomieSektion>` einhängt

### SVG-Mondsichel-Geometrie · Plan-First-festgenagelt
Mathematischer Ansatz: beleuchteter Bereich = SVG-Pfad mit zwei Bögen (Aussen-Kreis + Innen-Ellipse). Terminator-Faktor `k = 1 - 2*f` (f = Beleuchtungs-Anteil 0..1) bestimmt:
- `k > 0` (Sichel, <50%): Innen-Ellipse wölbt sich NACH INNEN
- `k = 0` (Halbmond): rxInner=0 → Innenbogen degeneriert zu Gerade
- `k < 0` (Gibbous, >50%): Innen-Ellipse wölbt sich NACH AUSSEN über Mittellinie
SVG-Sweep-Flags kippen automatisch zwischen Sichel und Gibbous · `ist_zunehmend` steuert die Seite (rechts/links).

### Verifikation
- SunCalc-Live-Test heute (14.5.2026): 7% Beleuchtung, `isWaxing=false`, kurz vor Neumond → muss dünne LINKE Sichel zeigen
- SVG-Pfad-Inspektion auf Production: `M 30,6 A 24,24 0 0 0 30,54 A 20.64,24 0 0 1 30,6 Z` → aussenSweep=0 (ccw, linke Seite), rxInner=20.64 (= 0.86 * 24), innenSweep=1 (Sichel cw) → korrekt für abnehmend ✓
- Synthetische Pfad-Tests für alle Phasen (Neumond, Sichel, Halbmond, Gibbous, Vollmond) im Browser durchgerechnet · Halbmond degeneriert sauber auf rx=0 · Gibbous wölbt korrekt nach aussen
- Build ✅ lokal · TypeScript-strict ohne Fehler
- /wetter visuell: 7 vertikale Bars (Fr–Do), Min/Max-Range erkennbar, Y-Achse °C-Werte, Mondphase-Card mit dünner linker Sichel
- Light/Dark: Bars wechseln zwischen Sumi-Schwarz und Washi (DRG-Theme greift live), Mond bleibt mit Konturkreis lesbar
- Mobile 375px: Bars in voller Breite, Mond-SVG erkennbar mit deutlicher linker Sichel
- Console clean (nach Dev-Server-Restart wegen HMR)
- Vercel-Push grün · /wetter rendert beide Komponenten

### `ist_bemerkenswert`-Force entfiel
Heute (14.5.2026) sind die Eta-Aquariden aktiv (Mai-Meteor-Schauer) → `ist_bemerkenswert: true` → AstronomieSektion rendert ohne Force. Wegwerf-Edit war nicht nötig.

### Files dieser Session
- `src/components/wetter/WetterWochenBars.astro` (neu)
- `src/components/wetter/MondphaseSvg.astro` (neu)
- `src/lib/echartsRenderer.ts` (initWetterWochenBars)
- `src/lib/astronomieResolver.ts` (ist_zunehmend exportieren)
- `src/components/wetter/AstronomieSektion.astro` (MondphaseSvg integriert)
- `src/pages/wetter.astro` (WetterWochenBars eingehängt)
- `_pendenzen.md` (4.6 ✅, 4.7 als nächstes)
- `SESSION_LOG.md` (Update 30)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` §6 (4.6 ✅)
- `docs/HANDOVER.md` (Stand nach 4.6 · 4.7 als nächster Schritt)

---

## 26-05-14 (Update 29) · Spec-Sync nach 4.5c · Phase-4-Spec auf realen Stand + Eyebrow

### Was gemacht
Reiner Doku-Slice plus ein winziger UI-Edit. Phase-4-Spec war an mehreren Stellen durch die Realität nach Slice 4.5/4.5b/4.5c überholt.

**UI-Edit (separater feat-Commit):**
- `KryptoSektion.astro`: Eyebrow "Krypto · Watchlist" → "Krypto · Märkte"
  Begründung: Nach IA-Umbau sind es kuratierte Krypto-Blöcke, kein "Watchlist"-Konzept mehr. "Märkte" reiht sich konsistent neben AKTIEN · US TECH, FOREX · COMMODITIES, NEWS · WIRTSCHAFT ein (KEY · QUALIFIER-Struktur).

**Spec-Sync (separater docs-Commit):**

Sync-Strategie wie von Mario vorgegeben: faktische Fehler korrigieren, Entscheidungs-Historie erhalten. §4.1-Schema und §5-Tabelle direkt aktualisiert (Referenzen, kein Diskurs). §7.3/§7.4/§7.5 bekamen Realitäts-Boxen am Anfang, der ursprüngliche Spec-Text bleibt darunter als Kontext stehen.

- **§2 Architektur**: Twelve Data aus "Live-APIs Page-SSR" raus, in "eigene API-Routes mit Edge-Cache + SWR seit 4.5" verschoben. Cache-Beschreibung präzisiert (60s Page + 20-22min TD-Endpoints + 30min Wetter).
- **§3 Modul-Tabelle**: Indices/Commodities als ENTFÄLLT markiert (statt gelöscht — Mario-Strategie). Aktien-Liste korrigiert (AAPL/NVDA/TSLA/MSFT/AMZN/META statt GOOGL/COIN). Neue Sektion "Asset-Sektionen" statt "Watchlist Multi-Asset". Indices-Klärung als beantwortet vermerkt.
- **§4.1 watchlist.json-Schema**: Komplettes JSON-Beispiel ersetzt — vom alten 6-Gruppen-TradingView-Schema mit `api_id`/`typ`/`anbieter:twelve_data` auf das reale 2-Krypto-Block-Schema (`id`/`symbol`/`name`/`anbieter:coingecko`). Mario-TODO ("Coin-IDs verifizieren") entfernt — in 4.5b erledigt.
- **§5 Komponenten-Liste**: Aggregator-Rename, drei Komponenten-Renames (Watchlist→Krypto), WatchlistItem-Löschung, AssetCard-Add, neue Daten-Module (aktien.ts/forex.ts), neue API-Routes alle ergänzt mit Slice-Verweis.
- **§6 Slice-Tabelle**: 4.5b/c-Zeile von "4.5b ✅ · 4.5c offen" auf beide ✅, plus Detail-Hinweis zum Eyebrow-Fix.
- **§7.3 Slice 4.3**: Realitäts-Box am Anfang (kryptoAggregator-Rename, Endpoint-Architektur-Erzwingung, Bulk-Credit-Annahme war falsch).
- **§7.4 Slice 4.4**: Realitäts-Box am Anfang (Komponenten-Renames, AssetCard-Konsolidierung, Card-Grid statt Zeilenliste, Logo-Kreis weg, Eyebrow neu).
- **§7.5 Slice 4.5**: Bestehende Realitäts-Box um 4.5b-Konsolidierung erweitert (AktienSektion via AssetCard, 3×2 statt 2×2, kein 4er-Strip).
- **§7.8 Slice 4.8**: Reihenfolge-Beschreibung "WatchlistSektion (4.4)" → "KryptoSektion (4.4 + 4.5b)".
- **§9 Offene Fragen**: Fragen 1-4 als BEANTWORTET markiert mit Slice-Verweis. Frage 5 (Macro-Events-Workflow) bleibt offen für Slice 4.7.
- **§11 Stolpersteine**: Punkt 14 (Symbol-Format) auf real `td_symbol`-Feld korrigiert, Commodities-Hinweis aktualisiert. Punkte 17-21 NEU (8/min-Limit hart, Vite-HMR nach git mv, Edge-Cache nicht in npm-dev, Refactor-Verifikation, Defensive-Vertrag-Prüfung).
- **Header**: `aktualisiert: 26-05-13` → `26-05-14 (Spec-Sync nach Slice 4.5c)`, `status:` aktualisiert auf realen Stand.

### Verifikation
- Build ✅ lokal · keine TypeScript-Fehler (auch wegen dem einen Eyebrow-Edit Pflicht)
- /wirtschaft lokal: Eyebrow zeigt "KRYPTO · MÄRKTE", sonst alles identisch · 18 Cards
- Console clean
- Vercel-Eyebrow-Verifikation steht aus (mit docs-Commit-Push)

### Was bewusst NICHT angefasst
- watchlist.json-Filename (Entscheidung 4.5b)
- Phase-2.2/2.3-Specs (abgeschlossen, korrekt)
- Wortform "Watchlist" in den Daten-Modul-Kommentaren (legitimer Konzept-Begriff)

### Files dieser Session
- `src/components/wirtschaft/KryptoSektion.astro` (Eyebrow · feat-Commit)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` (Spec-Sync · docs-Commit)
- `_pendenzen.md` (Spec-Sync ✅)
- `SESSION_LOG.md` (Update 29)
- `docs/HANDOVER.md` (Stand nach Spec-Sync · nächster Schritt = Slice 4.6)

---

## 26-05-14 (Update 28) · Slice 4.5c · Daten-Architektur-Cleanup

### Was gemacht
Reiner interner Refactor · kein Pixel auf /wirtschaft ändert sich · keine API-Calls.

- `src/lib/watchlistAggregator.ts` → `src/lib/kryptoAggregator.ts` via `git mv` (Historie erhalten)
- Funktion `getWatchlist()` → `getKryptoWatchlist()`
- `tdMapVorgegeben`-Parameter entfernt · der Aggregator ist jetzt reiner Krypto-Aggregator
- `getTwelveDataStand` + `TwelveDataStand`-Imports entfernt
- Toter twelvedata-Branch im Gruppen-Loop entfernt (watchlist.json hat seit 4.5b nur noch `anbieter: "coingecko"`)
- `Promise.allSettled` → Direct-Await (single-Promise wurde überflüssig nach Cleanup)
- `tageshoch`/`tagestief`-Felder aus `KryptoItemEnriched` entfernt (waren nur für Twelve-Data-Aktien)
- Typ-Renames:
  - extern exportiert: `WatchlistErgebnis` → `KryptoWatchlistErgebnis`, `WatchlistGruppeEnriched` → `KryptoGruppeEnriched`
  - modul-intern (jetzt unexportiert): `WatchlistItem` → `RohItem`, `WatchlistGruppe` → `RohGruppe`, `WatchlistItemEnriched` → `KryptoItemEnriched`
- `RohItem.anbieter` strikt auf `'coingecko'` typisiert (statt `'coingecko' | 'twelvedata'`)
- `src/components/wirtschaft/KryptoSektion.astro`: Import-Pfad + Typ + obsolet-Kommentar entfernt
- `src/components/wirtschaft/KryptoGruppe.astro`: Import-Pfad + Typ
- `src/pages/wirtschaft.astro`: Import-Pfad + Aufruf `getKryptoWatchlist()`
- `src/lib/coingeckoFetcher.ts:90`: Kommentar-Update "für watchlistAggregator" → "für kryptoAggregator"

### Prüfpunkt vor Edit · Promise.allSettled → Direct-Await
Verifiziert vor Refactor: `getKryptoStandFuerIds` ([coingeckoFetcher.ts:92-130](src/lib/coingeckoFetcher.ts:92)) hat den gesamten Fetch-Block in einem try mit ungefiltertem catch (Z.126 `catch {}` ohne Parameter), plus Early-Return bei leerem ids-Array (Z.93). Kein Code-Pfad kann eine Rejection werfen. Direct-Await ist sicher.

### Bewusst NICHT angefasst
- `watchlist.json`-Filename und Inhalt
- UI-Eyebrow "Krypto · Watchlist" (sichtbarer Text)
- Wortform "Watchlist" in historischen Kommentaren (aktien.ts, forex.ts, wirtschaftResolver.ts, KryptoGruppe.astro)

### Datei-Schrumpfung
`kryptoAggregator.ts`: 157 → 110 Zeilen · ~30% Reduktion durch Dead-Code-Entfernung. Lesbarkeit deutlich besser: ein einziger Datenpfad statt parallel-twelvedata-Branch.

### Verifikation
- Build ✅ lokal · keine TypeScript-Fehler
- Final-grep `grep -rn "Watchlist\|watchlistAggregator\|getWatchlist" src/` zeigt nur noch:
  - neue Identifier (KryptoWatchlistErgebnis, getKryptoWatchlist, kryptoAggregator)
  - Wortformen "Watchlist" als Konzept-Begriff in Kommentaren (legitim)
  - UI-Eyebrow "Krypto · Watchlist" (bewusst belassen)
- /wirtschaft lokal: strukturell identisch zu 4.5b-Endstand · 18 Asset-Cards · 2 Krypto-Blöcke · gleicher Eyebrow
- CoinGecko war heute zickig (heute viele API-Tests) → defensive Logik greift sauber (alle Items zeigen "—", kein Crash). Genau das richtige Verhalten für einen Refactor-Slice mit unzuverlässigem upstream.
- Console clean (nach Dev-Server-Restart wegen HMR-Cache · Stolperstein 7)
- Vercel-Deploy + Production-Verifikation steht aus (gehört zum docs-Commit-Push)

### Files dieser Session
- `src/lib/watchlistAggregator.ts` → `src/lib/kryptoAggregator.ts` (Rename + clean rewrite)
- `src/components/wirtschaft/KryptoSektion.astro` (Imports + Typen)
- `src/components/wirtschaft/KryptoGruppe.astro` (Imports + Typen)
- `src/pages/wirtschaft.astro` (Imports + Funktionsaufruf)
- `src/lib/coingeckoFetcher.ts` (Kommentar)
- `_pendenzen.md` (4.5c ✅ · Spec-Sync als nächstes)
- `SESSION_LOG.md` (Update 28)
- `docs/HANDOVER.md` (Stand nach 4.5c · nächster Schritt = Spec-Sync, danach 4.6)

---

## 26-05-14 (Update 27) · Slice 4.5b · Krypto-Card-Rebuild + Watchlist-IA-Umbau

### Was gemacht
- `src/components/wirtschaft/AssetCard.astro` (neu): gemeinsame Karten-Basis · Layout grid-template-areas (symbol/delta oben, name/preis mitte, extra-Zelle als Fuss) · extra-Zelle disjunkt: Mini-Sparkline (Krypto) ODER Tageshoch/-tief-Range (Aktien) · Sparkline-Hairline auf Mobile ausgeblendet (kein "leerer Trenner")
- `src/components/wirtschaft/KryptoSektion.astro` (Rename von WatchlistSektion via git mv) · Eyebrow "Krypto · Watchlist"
- `src/components/wirtschaft/KryptoGruppe.astro` (Rename von WatchlistGruppe via git mv + Refactor) · Card-Grid statt Zeilen-Liste · collapsible-Pattern bleibt (Button + aria-expanded)
- `src/components/wirtschaft/WatchlistItem.astro` (gelöscht) · KryptoGruppe iteriert direkt über `<AssetCard>`
- `src/data/aktien.ts` (neu) · typesafe `AKTIEN_DEFINITION: AktieDefinition[]` mit { id, symbol, name, td_symbol }
- `src/data/forex.ts` (neu) · analog für Forex
- `src/data/watchlist.json`: nur noch zwei Krypto-Blöcke `krypto-block-1` (BTC/ETH/SOL/XRP/SUI/TRX) + `krypto-block-2` (ADA/AVAX/HBAR/JUP/GST/DOT) · Aktien/Forex/Indizes-Gruppen alle raus
- `src/components/wirtschaft/AktienSektion.astro`: refactor auf AssetCard · Props { stand: TwelveDataStand[]; fetch_zeit: string } · mergt AKTIEN_DEFINITION mit stand-Map per id
- `src/components/wirtschaft/ForexCommoditiesSektion.astro`: refactor · Tabellen-Layout bleibt · Datenquelle FOREX_DEFINITION + stand-Array · Commodities-Tabelle hat statischen Leer-Hinweis (keine items.length-Check mehr nötig)
- `src/pages/api/aktien.ts` + `src/pages/api/forex.ts`: importieren aus aktien.ts/forex.ts statt watchlist.json
- `src/pages/wirtschaft.astro`: KryptoSektion + AktienSektion + ForexCommoditiesSektion · drei separate Datenpfade · getWatchlist() OHNE tdMap-Parameter (Übergangszustand bis 4.5c) · Aktien NICHT mehr doppelt

### CoinGecko-ID-Verifikationsergebnis (für 4.5c und später)
Bulk-Live-Call gegen `/coins/markets` mit allen 12 Coins · alle plausible Preise, alle market_cap_rank gesetzt:

| Symbol | CoinGecko-ID | Bemerkung |
|---|---|---|
| TRX | `tron` | **neu** · 3 ID-Kandidaten (tron, tron-bsc, solana-bridged-trx-solana); `tron` ist Mainnet (Rank 8) |
| HBAR | `hedera-hashgraph` | nur 1 Match, eindeutig |
| JUP | `jupiter-exchange-solana` | 2 ID-Kandidaten; `jupiter-exchange-solana` ist der Solana-DEX-Aggregator (Rank 86), `jupiter` ist ein älteres Projekt |
| GST | `green-satoshi-token` | Symbol mehrdeutig (GST-SOL vs GST-BSC); historisch immer Solana-Variante in der Watchlist · BSC-Variante existiert als `green-satoshi-token-bsc` falls jemals nötig |
| Weitere | bitcoin, ethereum, solana, ripple, sui, cardano, avalanche-2, polkadot | unverändert aus 4.3 |

Im UI: GST-Symbol als `GST` anzeigen, nicht das CoinGecko-Symbol `GST-SOL` (war auch in 4.3-Watchlist so).

### Architektur-Festlegung B2 · gemeinsame AssetCard
EINE Karten-Basis, getrennte Gruppen-Logik:
- Krypto: zwei thematische Blöcke, collapsible · Mini-Sparklines im AssetCard-extra
- Aktien: flache 6er-Liste, nicht collapsible · Tageshoch/-tief im AssetCard-extra
- Forex: bleibt **Tabellen-Layout**, keine Cards (Mario-Entscheidung — verdichtete Übersicht ist hier richtig)

### Prüfpunkt 1 · getWatchlist() im Übergangszustand
Verifiziert: Der alte watchlistAggregator durchläuft die neue Krypto-only watchlist.json sauber. `tdItems`-Filter matched nichts (keine `anbieter: "twelvedata"`-Items mehr). `getTwelveDataStand([])` hat Early-Return ohne API-Call. Keine stillen Fehler. 0 verbrannte Credits.

### Prüfpunkt 2 · grep nach alten Komponenten-Namen
Alle Treffer waren Typ-Namen (`WatchlistGruppeEnriched`, `WatchlistItem` als Interface), nicht Komponenten. Die Typ-Renames sind 4.5c-Scope.

### Was BEWUSST NICHT in 4.5b
Aufgeteilt nach Mario-Vorgabe in sichtbar (4.5b) vs unsichtbar (4.5c):
- `watchlistAggregator.ts` → `kryptoAggregator.ts` Rename + tdMap-Parameter raus → **4.5c**
- Typ-Renames (`WatchlistErgebnis` → `KryptoWatchlistErgebnis` etc.) → **4.5c**
- Aggregator-Code-Cleanup → **4.5c**

### Stolperstein-Notiz · Vite-HMR-Cache nach git mv
Nach den zwei git-mv-Operationen (WatchlistSektion → KryptoSektion, WatchlistGruppe → KryptoGruppe) zeigte der Vite-Dev-Server HMR-Reload-Errors für die alten Pfade. Production-Build war sauber. Dev-Server-Neustart hat die Errors entfernt. Bekannt als SKILL.md Stolperstein 7 ("HMR-Cache-Bug bei Vite-Dev-Server nach Layout-Edits · Dev-Server neu starten").

### Verifikation
- Build ✅ lokal · keine TypeScript-Fehler
- /wirtschaft visuell verifiziert: zwei Krypto-Blöcke (je 6 Cards mit Sparklines), AktienSektion (6 Cards mit H/T-Range), ForexCommoditiesSektion (Tabelle + Leer-Hinweis)
- 18 Asset-Cards total (12 Krypto + 6 Aktien) · Aktien-Doppelung weg (vorher 6+6=12 Aktien-Anzeigen, jetzt nur 6)
- Neue Coins live: TRX $0.3546 (+1.17%), HBAR $0.0935 (+0.87%), JUP $0.2208 (-3.13%), GST $0.0017 (+1.35%)
- Light/Dark verifiziert · Vermillon nur bei negativem Delta
- Mobile 375px: 1-Spalten-Cards, Sparkline-extra-Zelle ausgeblendet (sauber, kein leerer Trenner)
- Console clean nach Dev-Restart
- Vercel-Deploy + Production-Verifikation steht aus (gehört zum docs-Commit-Push)

### Files dieser Session
- `src/components/wirtschaft/AssetCard.astro` (neu)
- `src/components/wirtschaft/KryptoSektion.astro` (Rename von WatchlistSektion + Kleanup)
- `src/components/wirtschaft/KryptoGruppe.astro` (Rename von WatchlistGruppe + Card-Grid-Refactor)
- `src/components/wirtschaft/WatchlistItem.astro` (gelöscht)
- `src/components/wirtschaft/AktienSektion.astro` (Refactor auf AssetCard)
- `src/components/wirtschaft/ForexCommoditiesSektion.astro` (Refactor · neue Datenquelle)
- `src/data/aktien.ts` (neu)
- `src/data/forex.ts` (neu)
- `src/data/watchlist.json` (nur Krypto-Blöcke)
- `src/pages/api/aktien.ts` + `src/pages/api/forex.ts` (Imports umgestellt)
- `src/pages/wirtschaft.astro` (drei separate Datenpfade)
- `_pendenzen.md` (4.5b ✅, 4.5c als nächstes)
- `SESSION_LOG.md` (Update 27)
- `docs/HANDOVER.md` (Stand nach 4.5b, 4.5c als nächstes)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` (4.5b/4.5c-Hinweis bei §6 — sind keine Spec-Slices)

---

## 26-05-14 (Update 26) · Slice 4.5 · Aktien + Forex/Commodities-Sektion · Twelve-Data-Endpoint-Architektur

### Was gemacht
- `src/components/wirtschaft/AktienSektion.astro` (neu): 6 US-Tech-Cards in 3-Spalten-Grid (Desktop) / 2-Spalten (Tablet) / 1-Spalten (Mobile) · Preis in Fraunces · Delta-Vermillon-Regel wie 4.4 · Tageshoch/-tief als Subtext aus quote.high/low
- `src/components/wirtschaft/ForexCommoditiesSektion.astro` (neu): zwei kompakte Tabellen (Forex links, Commodities rechts) · Commodities-Gruppe leer → dezenter Leer-Hinweis "Im aktuellen Datentier nicht verfügbar" · strukturell vorbereitet für späteren Plan
- `src/lib/twelveDataFetcher.ts`: `tageshoch`/`tagestief` aus `quote.high`/`quote.low` als optionale Felder (für Aktien-Card-Subtext)
- `src/lib/watchlistAggregator.ts`: optionaler `tdMap`-Parameter für Endpoint-DI · per-default Direct-Call wie bisher
- `src/pages/api/aktien.ts` (neu): SSR-Endpoint · 6 Aktien-Symbole · Cache-Control `s-maxage=1200, stale-while-revalidate=3600` · `no-store` bei Offline-Response (kein Cache-Poisoning)
- `src/pages/api/forex.ts` (neu): SSR-Endpoint · 4 Forex-Paare · Cache-Control `s-maxage=1320` (TTL-Versatz +120s für auseinandergedriftete Background-Refreshes) · `no-store` bei Offline
- `src/pages/wirtschaft.astro`: sequenzielle TD-Endpoint-Fetches via `holeTwelveDataStand(origin)` · `await fetch(/api/aktien)` dann `await fetch(/api/forex)` · ergebnis-Map an `getWatchlist(tdMap)` · Reihenfolge §7.8 (KryptoHero → TradingIndikatoren → Watchlist → Aktien → Forex/Commodities → News → TradeSetups)
- `src/data/watchlist.json`: 4 Commodity-Items entfernt (WTI/GOLD/SILVER/BRENT — Free Tier liefert nichts Brauchbares · siehe Erkenntnisse) · Rohstoffe-Gruppe komplett entfernt · Indizes `td_symbol` weggelassen (rendern als Offline-Stub in der Watchlist, kosten keine Credits mehr)
- `src/components/wirtschaft/IndizesGrid.astro`: gelöscht · einziger Indizes-Ort ist jetzt die Watchlist-Gruppe
- `src/data/wirtschaft.json` + `src/lib/wirtschaftResolver.ts`: statische Indizes-Daten + `Index`-Type entfernt
- `src/components/layout/Footer.astro`: "Phase 2.3" → "Phase 4" (global, auf allen Seiten)

### Erkenntnisse · für Spec-Sync und künftige Slices

**Twelve Data Free Tier hat zwei harte Limits:**
- 800 API Credits/Tag
- 8 API Credits/Minute (Sliding-Window)
- **1 Credit pro Symbol** im Bulk-Call · ein 10-Symbol-Bulk = 10 Credits = sofort 429 ("10 API credits were used, with the current limit being 8")

**Das hat eine Endpoint-Architektur erzwungen:**
- Statt einem Page-Fetch mit 10 Symbolen: zwei getrennte API-Routes (`/api/aktien` 6 Credits, `/api/forex` 4 Credits)
- Jeder Endpoint einzeln unter 8/min-Limit
- Geteilter Vercel-Edge-Cache mit stale-while-revalidate (1200s/1320s mit TTL-Versatz)
- Bei Offline-Response (z.B. 429): `no-store` Header verhindert Cache-Poisoning
- Daily-Total: ~720 Credits/Tag (3×6 Aktien + 2.7×4 Forex pro Stunde × 24h)

**Diese Architektur ist die einzige, die Mario's Asset-Vollständigkeit (alle 6 Aktien + alle 4 Forex) unter Free-Tier-Bedingungen erfüllt.** Sliding-Window ist hart, nicht weich. Pro Slice-Iteration: drei Pläne nötig, weil die ersten zwei (handgebauter Cache, single-Endpoint) am 8/min-Limit gescheitert wären.

**WTI/GOLD im Twelve-Data-Free-Tier-Bug:**
- `symbol=WTI` matched die NYSE-Common-Stock-Aktie **W&T Offshore Inc.** ($4.40) — das war der Bug aus 4.3-Test
- `symbol=GOLD` matched die NYSE-Aktie **Gold.com, Inc.** ($41), nicht Gold-Spot
- `symbol=SILVER` → 403 (nicht im Free Tier)
- `symbol=XBR/USD` (Brent) → 403 (nicht im Free Tier)
- Alle vier komplett aus `watchlist.json` entfernt · keine Blocklist-Hacks im Code · saubere Wurzel-Lösung
- Crude-Oil-Spots gibt's im Free Tier nur als ETFs (USO, UCO) — semantisch nicht WTI-Spot, weggelassen

**Indizes (SPX/NDX/DAX/SMI) bleiben als Offline-Stub in der Watchlist-Gruppe:**
- `td_symbol`-Feld weggelassen → Aggregator-Filter schliesst sie automatisch vom API-Call aus
- Items rendern weiterhin als Gruppe in der Watchlist-Sektion mit "· nicht verfügbar"-Label
- Spart 4 Credits pro Refresh, ohne den UI-Block zu zerstören

**Cold-Start auf Vercel (verifiziert):**
- Erster Page-Hit nach Deploy: /api/aktien → 6 Credits ok, /api/forex → 4 Credits in derselben Minute → 6+4=10 → 429 → Forex offline auf erstem Hit
- Zweiter Hit (~60s später): /api/aktien Cache-HIT (0 Credits), /api/forex frisch (4 Credits) → LIVE
- Page-Cache `x-vercel-cache: STALE` → `HIT` mit aktualisiertem Inhalt
- Genau wie geplant — kein Architektur-Issue, nur eine Cold-Start-Eigenheit

### Spec-Sync nötig (Phase-4-Spec §7.5)
Die Spec ist von vor diesem API-Test. Die Realität ist enger:
- Commodities-Sektion zeigt nur Leer-Hinweis (vorher: "WTI live falls Test sauber, BRENT nicht verfügbar")
- Indices-Fallback B gewählt (weglassen)
- Endpoint-Architektur statt Direct-Call
- Bezahlten Twelve-Data-Plan wäre die einzige Alternative für mehr Asset-Breite

### Drei-Pläne-Iteration vor dem Bauen
Plan 1 (Blocklist im Fetcher) verworfen — Wurzel: Symbole aus watchlist.json raus.
Plan 2 (In-Memory-Cache + Selbst-Rate-Limiting) verworfen — pro Vercel-Instanz nicht zuverlässig + zu viel Maschinerie.
Plan 3 (eigene API-Endpoints mit Edge-Cache + SWR) angenommen, ergänzt um Option 2 (zwei Endpoints sequenziell statt einem).

Plan-First hat sich bewährt: drei Iterationen über Strategie haben sicheres Bauen vor Push ergeben.

### Verifikation
- Build ✅ lokal · Vercel-Deploy grün · /api/aktien + /api/forex liefern Live-JSON
- Cache-Header per curl: `x-vercel-cache: HIT` mit `age: 12s` für /api/aktien
- /wirtschaft auf Production: EUR/USD $1.17, CHF/USD $1.28, AAPL $298.87 etc. (nach 1× page-cache stale-while-revalidate-Refresh)
- Light/Dark/Mobile 375px lokal verifiziert
- Console clean
- Footer "Phase 4" auf /wirtschaft + Cover gegengecheckt

### Pendenz · Cover-Meta-Stempel
Auf der Cover-Page (/) zeigt ein internes Meta-Element (nicht der globale Footer) noch "MARIO'S HQ · V0.1 · PHASE 2.2". Das ist ein anderer Cover-Layout-Bereich, im 4.5-Footer-Fix nicht erfasst. In `_pendenzen.md` notiert als Mini-Hygiene-TODO.

### Files dieser Session
- `src/components/wirtschaft/AktienSektion.astro` (neu)
- `src/components/wirtschaft/ForexCommoditiesSektion.astro` (neu)
- `src/components/wirtschaft/IndizesGrid.astro` (gelöscht)
- `src/components/layout/Footer.astro` (Phase-Label)
- `src/lib/twelveDataFetcher.ts` (tageshoch/tagestief)
- `src/lib/watchlistAggregator.ts` (tdMap-DI · tageshoch/tagestief pass-through)
- `src/lib/wirtschaftResolver.ts` (Indizes raus)
- `src/data/watchlist.json` (Commodities raus · Indizes-td_symbol raus)
- `src/data/wirtschaft.json` (indizes-Array raus)
- `src/pages/api/aktien.ts` (neu)
- `src/pages/api/forex.ts` (neu)
- `src/pages/wirtschaft.astro` (sequenzielle TD-Endpoint-Fetches · neue Sektionen · Reihenfolge §7.8)
- `_pendenzen.md` (Slice 4.5 ✅ · Phase-4-Status aktualisiert · Cover-Meta-Stempel als TODO)
- `SESSION_LOG.md` (Update 26)
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` (§6 Slice-4.5-Status + Realitäts-Hinweis)

---

## 26-05-14 (Update 25) · Slice 4.4 · Watchlist-Komponenten mit Gruppierung

### Was gemacht
- `coingeckoFetcher.ts`: `sparkline=true` in `getKryptoStandFuerIds` · `KryptoStand` + `sparkline_7d?: number[]` · API-Typ mit `sparkline_in_7d?.price`
- `watchlistAggregator.ts`: `WatchlistItemEnriched` + `sparkline_7d?: number[]` · pass-through aus coingecko-Map
- `WatchlistItem.astro` (neu): Logo-Kreis (Mono-Buchstabe, selbst gerendert) · Preis in Fraunces adaptiv formatiert · Delta: Vermillon wenn negativ, `var(--fg-muted)` wenn positiv · Mini-Sparkline 80×20px Desktop-only für Crypto-Items · `ist_live: false` → "—" ohne Fehlertext
- `WatchlistGruppe.astro` (neu): Collapsible via Button + `aria-expanded` · kein `<details>` · DOM-only State (kein localStorage, Slice 4.4) · alleOffline-Gruppe trägt "· nicht verfügbar" im Header
- `WatchlistSektion.astro` (neu): Eyebrow "WATCHLIST · MÄRKTE" konsistent · Live-Stempel · gruppen-loop mit `WatchlistErgebnis`-Props
- `wirtschaft.astro`: `getWatchlist()` in 6-er `Promise.all` · `<WatchlistSektion>` nach TradingIndikatoren · CoinGecko-Doppelcall notiert für Merge-Optimierung Slice 4.8

### Erkenntnisse
- Kein Grün im DRG-System: positives Delta nutzt `var(--fg-muted)` neutral, nicht eine erfundene Farbe
- Fehlertext pro Item weglassen: tote Items zeigen nur "—", Gruppenebene trägt den Hinweis
- CoinGecko `/coins/markets?sparkline=true`: 7-Tage-Kurve pro Coin im Bulk-Request, kein Extra-Call
- Collapsible Default "offen" ist legitim für Übersichtsseite · localStorage-Persistierung als optionales Mini-Polish für Slice 4.8 notiert

### Nachtrag · Fix (14.5.2026)
- `src/lib/formatPreis.ts` (neu): zentraler Preis-Formatter · `$`-Präfix · de-CH Apostroph · adaptiv (≥1'000 → 0 Dez · ≥1 → 2 Dez · <1 → 4 Dez)
- `WatchlistItem.astro` + `KryptoHero.astro`: inline `formatPreis` entfernt, beide auf zentrale Funktion umgestellt
- `sources.json`: beide Cowork-Einträge entfernt (Cowork statisch/wirtschaft + Cowork kuratiert/news) — Entscheidung 13.5., Phase 5 entfällt

### Offene Pendenzen
- localStorage-Persistierung für Gruppen-Expand-Zustand → Mini-Polish Slice 4.8
- CoinGecko `getKryptoStand()` + `getKryptoStandFuerIds()` simultan → Merge-Optimierung Slice 4.8

### Verifikation
- Build ✅ · 3.74s · keine TypeScript-Fehler
- Push → Vercel-Deploy ausstehend

### Files dieser Session
- `src/lib/coingeckoFetcher.ts` (sparkline-Erweiterung)
- `src/lib/watchlistAggregator.ts` (sparkline pass-through)
- `src/components/wirtschaft/WatchlistItem.astro` (neu)
- `src/components/wirtschaft/WatchlistGruppe.astro` (neu)
- `src/components/wirtschaft/WatchlistSektion.astro` (neu)
- `src/pages/wirtschaft.astro` (6. Fetch + WatchlistSektion integriert)
- `_pendenzen.md` (Slice 4.4 ✅)
- `PHASE-4-SPEC §6` (4.1–4.4 → abgeschlossen)
- `SESSION_LOG.md` (Update 25)

---

## 26-05-14 (Update 24) · Slice 4.3 · Multi-Anbieter-Watchlist-Foundation

### Was gemacht
- `src/data/watchlist.json`: 6 Gruppen · 28 Items · Krypto Large/Mid (coingecko) · Aktien US (twelvedata) · Indizes · Forex · Rohstoffe
- `src/lib/coingeckoFetcher.ts`: `getKryptoStandFuerIds(ids)` ergänzt · Bulk `/coins/markets` · gibt `Map<id, KryptoStand>` zurück · Fallback leere Map
- `src/lib/twelveDataFetcher.ts` (neu): Key-Abwesenheit-Guard · Bulk-URL ein Request · Multi/Single-Symbol-Response-Unterscheidung · Fehler-Items (Plan nicht enthalten) als `ist_live: false` · 8s Timeout
- `src/lib/watchlistAggregator.ts` (neu): `Promise.allSettled` für CoinGecko + Twelve Data parallel · Lookup Maps mergen · WatchlistGruppeEnriched ausgeben · `ist_live` flag wenn mindestens ein Item live
- `src/pages/_test-watchlist.astro`: Temporäre Verifikations-Route mit Tabelle pro Gruppe · ✅/❌ pro Item · JSON-Rohdaten unter `<details>`

### Erkenntnisse
- Indizes (SPX, NDX, DAX, SMI) sind im Twelve Data Free Tier nicht enthalten · `ist_live: false` + Fehlertext · für Slice 4.5 geplant (bezahlter Tier oder Alternative)
- WTI liefert $4.40 statt ~$60 · suspekter Wert, vermutlich falsches Symbol oder Einheit · für Slice 4.5 zu untersuchen
- BRENT (XBR/USD) nicht im Free Tier · `ist_live: false` wie Indizes
- EUR/USD, CHF/USD, GBP/USD, EUR/CHF · Forex ✅ · AAPL, NVDA, TSLA, MSFT, AMZN, META · Aktien US ✅
- Kein zirkulärer Import: `twelveDataFetcher` hat eigene `TwelveDataItem`-Interface · kein Rückimport aus `watchlistAggregator`
- Security-Check ✅: `TWELVE_DATA_API_KEY` nicht im `dist/`-Bundle · server-only via `import.meta.env`
- Build ✅ · 3.13s · keine TypeScript-Fehler

### Verifikation
- Build grün · Security-Check sauber
- `_test-watchlist.astro` wartet auf visuellen Vercel-Check nach Push (dann löschen)

### Files dieser Session
- `src/data/watchlist.json` (neu)
- `src/lib/coingeckoFetcher.ts` (erweitert: `getKryptoStandFuerIds`)
- `src/lib/twelveDataFetcher.ts` (neu)
- `src/lib/watchlistAggregator.ts` (neu)
- `src/pages/_test-watchlist.astro` (temporär)
- `_pendenzen.md` (Slice 4.3 ✅ · Phase-4-Status aktualisiert)
- `SESSION_LOG.md` (Update 24)

### Nachtrag · Cleanup (14.5.2026)
- `_test-watchlist.astro` entfernt · war versehentlich committet, als temporäre Verifikations-Route geplant
- `PHASE-4-SPEC §4.1` mit Vermerk versehen · `watchlist.json` ist im MVP bewusst generisch, echte TradingView-Liste kommt beim /wirtschaft-Rework

---

## 26-05-13 (Update 23) · Tages-Abschluss · ENV-Setup + Vercel-Issues + Glassnode

### Was gemacht
- `TWELVE_DATA_API_KEY` in `.env` (lokal) und Vercel Dashboard in beiden Projekten (mario-hq + mario-hq-qc6f) eingetragen
- `KALENDER_ICAL_URL` ebenfalls in beiden Vercel-Projekten + lokal vorhanden
- `/kalender` auf `mario-hq-qc6f.vercel.app` zeigt jetzt Live-Daten · echte Termine aus Google Calendar via iCal
- Vercel-Doppel-Projekt entdeckt · ENV-Vars mussten in beiden eingetragen werden da separate Projekte trotz selbem Repo
- Vercel-Binance-Block entdeckt · 4 Trading-Indikator-Cards zeigen Fallback auf Production · lokal alles live
- Glassnode als potenzielle Erweiterung diskutiert · Mario offen für Subscription wenn Mehrwert klar

### Erkenntnisse
- ENV-Variables auf Vercel müssen pro Projekt einzeln gesetzt werden · gilt auch wenn dasselbe Repo deployt
- Redeploy nach ENV-Var-Änderung zwingend · „Use existing Build Cache" deaktivieren für sauberen Build
- Binance Futures-API von einigen Cloud-Provider-IPs geblockt · betrifft Vercel-Server-IPs · kein Code-Problem, sondern Netzwerk-Restriktion · Bybit/OKX als Alternative evaluieren
- Glassnode bietet On-Chain-Tiefe die mit Public-APIs nur teilweise nachbaubar · ETF Net Flows, Hash Rate, Exchange Balances, aggregierte Funding über alle Exchanges · Kosten-Nutzen-Abwägung steht aus

### Offene Pendenzen
- Slice 4.3 als nächstes · Multi-Anbieter-Watchlist-Foundation · Twelve-Data-Fetcher · ENV-Setup-Code
- Mini-Reparatur-Slice für Vercel-Binance-Block · Bybit/OKX oder Edge-Function-Proxy
- Mini-Hygiene-Slice für Vercel-Doppel-Projekt
- Glassnode-Entscheidung wenn Phase-4-Trading-Indikatoren produktiv laufen
- Mario-Frage offen: Trading-Daten-Tiefe (Glassnode) vs Asset-Breite (Watchlist ~30 Items)

### Files dieser Session
- `_pendenzen.md` (Phase-4-Status · Mario-TODOs aktualisiert · Production-Issues · neue Offene Fragen 8+9)
- `_projekt.md` (Decisions · Tool-Landschaft aktualisiert)
- `SESSION_LOG.md` (Update 23)

---

## 26-05-13 (Update 22) · Slice 4.2 · Trading-Indikatoren-Block

### Was gemacht
- `binanceFetcher.ts`: 12 parallele Calls für BTC/ETH/SOL · Funding Rates / Open Interest (mit 24h-History) / Long/Short Ratio (mit 24h-History) · AbortSignal.timeout 5s · Fallback auf leere Arrays
- `coinbasePremiumFetcher.ts`: Eigenlogik Binance vs Coinbase BTC-Preis-Differenz · 5 Interpretations-Stufen (±0.05% neutral · ±0.2% strong)
- `defiLlamaFetcher.ts`: USDT+USDC Supply · Felder live verifiziert (`peggedAssets` · `circulating.peggedUSD` · `circulatingPrevDay.peggedUSD` · `circulatingPrevWeek.peggedUSD`)
- 5 neue Card-Komponenten: FundingRatesCard · OpenInterestCard · LongShortRatioCard · CoinbasePremiumCard · StablecoinSupplyCard
- `TradingIndikatoren.astro`: 3+2-Grid-Wrapper zwischen KryptoHero und Indizes-Block
- `wirtschaft.astro`: `Promise.all` mit 5 async Fetches (krypto · btcHistory · binance · coinbasePrem · stablecoins)
- `sources.json`: Binance Futures · Coinbase Exchange Rates · DeFiLlama ergänzt

### Erkenntnisse
- DeFiLlama Top-Level-Key ist `peggedAssets` (nicht `stablecoins`) · live verifiziert vor Code
- Binance OI History liefert `sumOpenInterest` (nicht `openInterest`) · Verifikation-first hat Fehler verhindert
- Funding-History-Endpoint bei Binance nicht vorhanden · `history_24h: []` für alle FundingRates gesetzt
- Sparkline-Komponente aus Slice 4.1 sauber wiederverwendet in OI und L/S Cards (6 Sparklines total)
- L/S Ratio ETH und SOL zeigten EXTREME (>2.0) beim Live-Test am 13.5.2026 — Badge korrekt ausgelöst
- Coinbase Premium -0.021% bei Verifikation — neutral, realistisch, Eigenlogik stimmt

### Verifikation
- 5 Cards sichtbar zwischen KryptoHero und Indizes-Block
- Funding: BTC +0.0012% · ETH +0.0042% · SOL -0.0132% (live)
- OI: 105'121 BTC · 2'260'068 ETH · 10'479'448 SOL mit Sparklines
- L/S: BTC 1.01 · ETH 2.86 EXTREME · SOL 2.30 EXTREME mit Sparklines
- Coinbase Premium: -0.021% Neutral · Binance/Coinbase Preise korrekt
- Stablecoin: $266.7 Mrd · USDT $189.7 Mrd · USDC $77 Mrd
- Dark Mode · Mobile 375px · Console clean

### Offene Pendenzen
- Slice 4.3 als Nächstes (Multi-Anbieter-Watchlist-Foundation · Twelve-Data-Fetcher)
- MARIO-TODO: Twelve-Data-Account erstellen für TWELVE_DATA_API_KEY (Slice 4.3)
- MARIO-TODO: KALENDER_ICAL_URL in Vercel (weiterhin offen)

### Files dieser Session
- `src/lib/binanceFetcher.ts` (neu)
- `src/lib/coinbasePremiumFetcher.ts` (neu)
- `src/lib/defiLlamaFetcher.ts` (neu)
- `src/components/wirtschaft/TradingIndikatoren.astro` (neu)
- `src/components/wirtschaft/FundingRatesCard.astro` (neu)
- `src/components/wirtschaft/OpenInterestCard.astro` (neu)
- `src/components/wirtschaft/LongShortRatioCard.astro` (neu)
- `src/components/wirtschaft/CoinbasePremiumCard.astro` (neu)
- `src/components/wirtschaft/StablecoinSupplyCard.astro` (neu)
- `src/pages/wirtschaft.astro` (modifiziert)
- `src/data/sources.json` (3 neue Anbieter)
- `_pendenzen.md` (Slice 4.2 abgehakt)
- `SESSION_LOG.md` (Update 22)

---

## 26-05-13 (Update 21) · Slice 4.1 · ECharts Foundation + BTC-Hero Sparkline

### Was gemacht
- `echarts-drg-theme.ts` erstellt: SSR-safe DRG Token Export · kein ECharts-Import · hardcodierte Hex-Werte (`#E34234` Vermillon, `#2A2A2A` Sumi, `#E8E4DC` Washi)
- `echartsRenderer.ts` erstellt: Client-only Utility · `initSparkline()` mit IntersectionObserver (lazy) · ResizeObserver (responsiv) · MutationObserver (LIVE Theme-Switch)
- `src/components/charts/Sparkline.astro` erstellt: neues Verzeichnis · Islands-Pattern via `<script>` · `data-values` Serialization auf Div · kein `define:vars` (würde Bundle-Splitting brechen)
- `coingeckoFetcher.ts` erweitert: `getBTCHistory()` für 7d-Stundenwerte (168 Punkte) · paralleler Fetch via `Promise.all`
- `KryptoHero.astro` erweitert: `btcHistory` Prop · Sparkline-Row unter preis-block · `7 Tage` Label · conditional render wenn leer
- `wirtschaft.astro`: `getBTCHistory` Import · `Promise.all([getKryptoStand(), getBTCHistory()])` für parallele Fetches
- `sources.json`: Apache ECharts Eintrag ergänzt

### Erkenntnisse
- Astro `<script>` Bundle-Splitting funktioniert korrekt: ECharts nur auf /wirtschaft · Cover `window.echarts === undefined` verifiziert
- LIVE Theme-Switch via MutationObserver auf `document.documentElement[data-theme]` + `chart.setOption()` — kein Reload nötig · **sofort sichtbar**
- `data-values` auf Div-Attribut ist die saubere Pattern für Props → Client-Script · `define:vars` würde Inline-Script erzeugen und Bundle-Splitting brechen
- ECharts DRG-Theme muss SSR-safe sein → separates File ohne ECharts-Import · Registration im Client-only `echartsRenderer.ts`
- Trend-Logik: letzter Wert < erster Wert → Vermillon · sonst Sumi-Light/Washi-Dark

### Verifikation
- Sparkline Canvas 1196px × 64px · volle Kartenbreite
- Vermillon-Linie korrekt (BTC 7d fallend)
- LIVE Theme-Switch bestätigt (kein Reload)
- Mobile 375px: Sparkline skaliert korrekt · kein Layout-Bruch
- Bundle-Splitting: `echartsScripts: []` auf Cover

### Offene Pendenzen
- Slice 4.2 (Trading-Indikatoren: Funding · OI · L/S · Coinbase Premium · Stablecoin)
- MARIO-TODO: Twelve-Data-Account erstellen für TWELVE_DATA_API_KEY (Slice 4.3)
- MARIO-TODO: KALENDER_ICAL_URL in Vercel (weiterhin offen)

### Files dieser Session
- `src/lib/echarts-drg-theme.ts` (neu)
- `src/lib/echartsRenderer.ts` (neu)
- `src/components/charts/Sparkline.astro` (neu · neues Verzeichnis)
- `src/lib/coingeckoFetcher.ts` (erweitert)
- `src/components/wirtschaft/KryptoHero.astro` (erweitert)
- `src/pages/wirtschaft.astro` (erweitert)
- `src/data/sources.json` (ergänzt)
- `_pendenzen.md` (Slice 4.1 auf [x])
- `SESSION_LOG.md` (Update 21)

---

## 26-05-13 (Update 20) · Phase 4 Spec dokumentiert

### Was gemacht
- PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md erstellt und ins Repo unter docs/ committed
- Vollständige Slice-Aufteilung 4.1 bis 4.8 spezifiziert
- 5 API-Anbieter dokumentiert mit Pattern-Vorgaben
- watchlist.json-Schema mit 30 Items aus Marios TradingView-Setup
- ECharts-DRG-Theme-Konzept festgelegt
- Indices-Test als kritischer Punkt in Slice 4.5 identifiziert

### Erkenntnisse
- Phase-4-Spec ist umfangreicher als Phase 2.3 · ECharts-Lernkurve plus Multi-Asset-Komplexität
- Foundation-First-Strategie wie bei Slice 2.3.1 · Slice 4.1 räumt das technische Risiko (ECharts-Integration in Astro) frühzeitig ab
- Spec-Pattern bewährt sich als Brücken-Doku zwischen Strategie-Chats und Code-Sessions

### Offene Pendenzen
- Slice 4.1 als Nächstes (ECharts-Foundation + BTC-Hero mit Sparkline)
- MARIO-TODO: Twelve-Data-Account erstellen für TWELVE_DATA_API_KEY (Slice 4.3)
- MARIO-TODO: KALENDER_ICAL_URL in Vercel (weiterhin offen aus Phase 2.3)
- Move2Earn-Coin-IDs verifizieren via CoinGecko-API in Slice 4.4

### Files dieser Session
- `docs/PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md` (neu)
- `_pendenzen.md` (Spec-Referenz *(folgt)* entfernt)
- `SESSION_LOG.md` (Update 20)

---

## 26-05-13 (Update 19) · Strategische Wende vor Phase 4

### Was gemacht
- Strategie-Chat zur Phase-Reihenfolge nach Phase 2.3
- Entscheidung: Phase 4 (Charts) wird vorgezogen · Phase 3 (Content-Pipeline) auf wenn-dann-Status gesetzt · Phase 5 (Cowork-Automation) KOMPLETT entfernt aus Roadmap
- Phase 4 umdefiniert von 5-Punkt-Liste zu 8 Slices · Charts UND Trading-Watchlist UND Multi-Asset-Tracker auf /wirtschaft
- Trading-Indikatoren-Set definiert: Funding Rates, Open Interest, Long/Short Ratio, Coinbase Premium, Stablecoin Supply · alle gratis via Binance/Coinbase/DeFiLlama
- Watchlist-Struktur nach Marios TradingView-Setup · ~30 Items in Gruppen (Index, BTC, Move2Earn, Aktien, Forex, Commodities) · manuell gepflegt in JSON
- Twelve Data als API für Aktien/Forex/Commodities · Free Tier 800 Calls/Tag
- Apption.co diskutiert und verworfen · Native ECharts ist visuell konsistenter als iframe-Widgets
- Mario-Profile aktualisiert: Swing-Trader · Pragmatischer Maximalismus · 06:00 CEST Hard-Anforderung

### Erkenntnisse
- **Cowork-Verzicht ist Architektur-Befreiung.** Die ganze Scheduled-Task-Komplexität entfällt · Live-APIs liefern eh frische Daten · Read-First-Prinzip wird sauberer.
- **Editorial-Charakter bleibt erhalten** auch ohne Cowork · Zitate/Geschichte rotieren deterministisch über dayOfYear-Algorithmus (schon implementiert in Slice 2.2.1/2.2.2).
- **Trading-Watchlist auf /wirtschaft = Multi-Asset-Hub** · /wirtschaft wird zu langer scrollintensiver Seite · Editorial-Hero oben, Trading-Tools unten. Bewusste Architektur-Entscheidung.
- **Phase 4 wird grösser als Phase 2.3** mit 8 Slices. Foundation-First-Strategie (Slice 4.1 = ECharts-Foundation) wird wieder die Risiko-Eingangshürde abräumen wie bei Slice 2.3.1 (DetailPage-Layout).

### Offene Pendenzen
- PHASE-4-CHARTS-AND-WATCHLIST-SPEC.md folgt als Self-Contained-Spec in nächster Session
- MARIO-TODO: Twelve-Data-Account erstellen und API-Key bereitlegen für Slice 4.3
- MARIO-TODO weiterhin offen: KALENDER_ICAL_URL in Vercel Dashboard

### Files dieser Session
- `_pendenzen.md` (Phase 3 zurückgestellt · Phase 4 neu definiert · Phase 5 entfernt · aktuelle-phase auf 4)
- `_projekt.md` (Mario-Profile · Decisions · Daten-Architektur · Cowork-Bezüge entfernt)
- `SESSION_LOG.md` (Update 19)

---

## 26-05-13 (Update 18) · Slice 2.3.5 + Phase-2.3-Abschluss

### Was gemacht
- `suncalc` + `@types/suncalc` installiert für lokale Mondphase-Berechnung
- `astronomie-2026.json`: 6 Meteor-Schauer · 2 Planeten-Events · 8 Vollmonde · kuratiert aus astronomischen Jahresvorschauen
- `astronomieResolver.ts`: `getAstronomieHeute()` mit Bemerkenswert-Logik:
  Meteor aktiv ohne Mond-Problem · Planeten-Event ±7 Tage · Vollmond ±3 Tage · Mondphase immer via SunCalc
- `AstronomieSektion.astro`: conditional rendering (`ist_bemerkenswert=false` → unsichtbar) · auto-fit-Grid · Mobile 1-Spalte
- `wetter.astro`: Astronomie zwischen WetterDetail und FotoSpots integriert · `w-stack` auf `gap: var(--s-6)` erhöht
- Cross-Page-Polish: Footer "Phase 2.2" → "Phase 2.3" · Eyebrows/Back-Links/SourceStempel auf allen 4 Pages verifiziert
- Phase-2.3-Volltest: Build grün · Light/Dark/Mobile · Navigation · Console errors = 0 · Vermillon-Quote < 3%
- `_pendenzen.md`: Phase 2.3 ✅ · aktuelle-phase auf "3 (geplant)" · Aufräum-Tasks entfernt (alle erledigt) · Phase-3-Start-Tasks ergänzt

### Erkenntnisse
- **SunCalc-Import funktioniert direkt.** `import SunCalc from 'suncalc'` mit `@types/suncalc` (export =) klappt in Astro v6 / Vite ohne Workaround.
- **Conditional Rendering in Astro.** `{condition && (<section>...</section>)}` rendert exakt nil wenn `condition=false` — kein leeres DOM-Element, kein Layout-Platz verbraucht.
- **Eta-Aquariden heute aktiv.** 13.5.2026 liegt im Fenster 19.4.–28.5. → `ist_bemerkenswert=true` → Sektion sofort visuell verifizierbar ohne Datum-Mock.
- **Phase 2.3 hat alle 5 Slices an einem Tag geschafft.** SSR-Foundation aus 2.3.2 hat Folgeslices vereinfacht. DetailPage-Layout zentral war die richtige Entscheidung — Pattern-Klon-Strategie hat funktioniert.

### Phase-2.3-Synthese
- 4 Detail-Pages produktionsreif: /wirtschaft · /wetter · /news · /kalender
- 3 Live-API-Anbindungen mit Fallback: CoinGecko · Open-Meteo · iCal
- 8 Custom-SVG-Wetter-Symbole sumi-e-Stil
- Astronomie-Sektion conditional: SunCalc lokal + kuratierte 2026-Events
- Vercel-SSR-Hybrid-Mode aktiv (/wirtschaft · /wetter · /kalender = SSR · /news = SSG)
- Quellen-Transparenz via sources.json + SourceStempel auf allen Pages
- HQ ist als Site komplett — Cover hat 4 funktionierende Detail-Verlinkungen

### Offene Pendenzen
- **MARIO-TODO:** KALENDER_ICAL_URL in Vercel Dashboard eintragen (ohne das bleibt /kalender auf Fallback)
- Phase 3 Content-Pipeline geplant: Briefing-Schema · Astro Content Collections · Archive-Auto-Build
- Foto-Spots-Erweiterung über 4 Aargau-Spots hinaus (wenn Bedarf)

### Files dieser Session
- `src/data/astronomie-2026.json` (neu)
- `src/lib/astronomieResolver.ts` (neu)
- `src/components/wetter/AstronomieSektion.astro` (neu)
- `src/pages/wetter.astro` (Astronomie-Integration + s-6-Spacing)
- `src/components/layout/Footer.astro` (Phase 2.2 → 2.3)
- `package.json` / `package-lock.json` (suncalc + @types/suncalc)
- `_pendenzen.md` (Phase 2.3 ✅ · Phase 3 als nächste · Aufräum-Tasks entfernt)
- `SESSION_LOG.md` (Update 18)

---

## 26-05-13 (Update 17) · Slice 2.3.4 implementiert

### Was gemacht
- `news-voll.json` · 4 Kategorien (Tech · Foto · Architektur · Politik) · je 4 curated Headlines mit Quelle + URL
- `newsResolver.ts` · `getNewsKategorien()` ergänzt · `getNewsHeute()` für Cover-Kompatibilität beibehalten
- `KategorieBlock.astro` · Eyebrow + Headlines als `<a target="_blank">` · Quelle rechts in Mono · border-bottom zwischen Items
- `/news.astro` · SSG · 2-Spalten-Grid · DetailPage modul="news"
- `ical.js` installiert für iCal-Parse + Recurrence-Expansion
- `.env` Placeholder angelegt · `KALENDER_ICAL_URL` mit Dummy-Wert + ausführlichem Kommentar
- `kalender-fallback.json` · 5 Termine über 3 Tage (Mi 13.5. / Do 14.5. / Sa 16.5.) · Ganztags-Event "Glose-Tag im Studio" für Edge-Case-Test
- `icalFetcher.ts` · `KALENDER_ICAL_URL` server-only via `import.meta.env` · 5s AbortSignal-Timeout · ical.js VEVENT-Iterator mit Recurrence-Expansion · Heute+7-Tage-Fenster · Europe/Zurich · Fallback wenn ENV fehlt oder Fetch schlägt fehl
- `TerminListe.astro` · Tag-Gruppen mit Datum-Eyebrow · Heute-Tag in Vermillon-Accent · GANZTAG-Badge statt Uhrzeit · Fallback-Banner mit Border-Left
- `/kalender.astro` · SSR (prerender=false) · 5min Cache · eyebrow dynamisch mit heutigem Datum

### Sicherheit verifiziert
- `.env` in `.gitignore` (Zeile 19) ✓
- `grep -r "calendar.google.com" dist/` → kein Treffer ✓
- `/kalender` nicht in prerendering-Liste (SSR) ✓

**MARIO-TODO: KALENDER_ICAL_URL in Vercel Dashboard eintragen**
Settings → Environment Variables → Production + Preview + Development
Wert: Geheime iCal-URL (Google Calendar → Einstellungen → "Geheime Adresse im iCal-Format")

### Erkenntnisse
- **ical.js Recurrence-Iterator-Limit.** Ohne Iterations-Limit läuft der Iterator bei Endlos-Serienterminen in eine Endlosschleife. Fix: max 50 Occurrences pro Event + Break wenn `jsDate >= fensterEnd`.
- **Ganztags-Events in ical.js.** `dtstart.isDate === true` bei DATE-Properties (keine Zeit). Der `zeitVon()`-Helper darf für Ganztags-Events nicht aufgerufen werden — separater Code-Pfad nötig.
- **`T12:00:00Z`-Trick für Wochentag.** Konsistent mit openMeteoFetcher: Mittag UTC verhindert Timezone-Fehler bei `Intl.DateTimeFormat` für Europe/Zurich.

### Offene Pendenzen
- **MARIO-TODO:** KALENDER_ICAL_URL in Vercel Dashboard eintragen (ohne das bleibt /kalender auf Fallback)
- Slice 2.3.5 als Nächstes: Astronomie-Sektion in /wetter · Polish · Volltest · Phase-2.3-Abschluss
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/news-voll.json` (neu)
- `src/data/kalender-fallback.json` (neu)
- `src/lib/newsResolver.ts` (erweitert)
- `src/lib/icalFetcher.ts` (neu)
- `src/components/news/KategorieBlock.astro` (neu)
- `src/components/kalender/TerminListe.astro` (neu)
- `src/pages/news.astro` (ersetzt)
- `src/pages/kalender.astro` (ersetzt)
- `.env` (neu · nicht committed)
- `package.json` / `package-lock.json` (ical.js)

---

## 26-05-13 (Update 16) · Slice 2.3.3 implementiert

### Was gemacht
- 8 Wetter-Symbol-SVGs sumi-e monolinig in `src/components/wetter-symbole/` · Painters-Model für Wolken-Fill (var(--bg-card) überdeckt Sonnenstrahlen korrekt im Dark-Mode)
- `WetterSymbol.astro` Wrapper mit WMO-Code-Mapping · size-Prop via inline-flex (kein Scoping-Problem)
- `openMeteoFetcher.ts` · Open-Meteo Baden AG (47.4762, 8.3056) · forecast_days=8 · heute + 7 Wochentage · wochentagKurz via Intl (Europe/Zurich-safe)
- `fotoSpotPicker.ts` · 4-Regel-Algorithmus: Regen → kein Spot · Nebel+Frühmorgens → Lägern · Klar+Abend → Goldene-Stunde · Fallback → kürzeste Fahrzeit
- `WetterDetail.astro` · Hero mit 96px Symbol + Fraunces-Temp + Sonnenzeiten · 7-Tage-Strip (7 Karten, Mobile 4-Spalten)
- `FotoSpots.astro` · Empfehlung-Hero (Fraunces-Name · italic Hinweis · Tags) + Alle-Spots-Grid
- `/wetter.astro` auf DetailPage + SSR · Cache 30min/1h SWR

### Erkenntnisse
- **Painters-Model für SVG-Dunkel-Symbole.** `fill="var(--bg-card)"` auf Wolken-Pfad überdeckt Sonnenstrahlen korrekt — im Dark-Mode wechselt das automatisch zu sumi-dunkel ohne eigene Dark-Mode-Regel.
- **Worktree-Falle bestätigt.** Build ohne `cd /Users/mariomacstudio/Developer/mario-hq &&`-Prefix lief im Worktree und zeigte falsches Ergebnis (Static statt Hybrid). Konvention stärker einhalten.
- **Open-Meteo timezone-Param via `%2F`.** URL-Encoding für den Slash in `Europe/Zurich` ist nötig, sonst wird die Param falsch geparst.
- **Foto-Spot-Algorithmus aktuell sehr simpel.** Bei echter Nutzung wird sich zeigen welche Fälle fehlen (z.B. Föhn-Wind für Geissberg, Frühlings/Herbst-Filter).

### Offene Pendenzen
- Slice 2.3.4 als Nächstes (/news Slim + /kalender iCal Read-Only)
- Astronomie-Sektion in 2.3.5 (SunCalc + 2026-Events in /wetter)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen
- Foto-Spots-Datenbank über 4 Aargau-Spots hinaus erweitern (später)

### Files dieser Session
- `src/data/wetter-fallback.json` (neu)
- `src/data/foto-spots.json` (neu)
- `src/lib/openMeteoFetcher.ts` (neu)
- `src/lib/fotoSpotPicker.ts` (neu)
- `src/components/wetter-symbole/` (9 Files: 8 SVGs + Wrapper)
- `src/components/wetter/WetterDetail.astro` (neu)
- `src/components/wetter/FotoSpots.astro` (neu)
- `src/pages/wetter.astro` (modifiziert · DetailPage · SSR)
- `_pendenzen.md` (Slice 2.3.3 abgehakt)
- `SESSION_LOG.md` (Update 16)

---

## 26-05-13 (Update 15) · Slice 2.3.2 implementiert

### Was gemacht
- `@astrojs/vercel` Adapter installiert · `astro.config.mjs` mit `adapter: vercel()` · `.vercel/` in `.gitignore`
- `/wirtschaft.astro` auf SSR umgestellt via `export const prerender = false` · echter CoinGecko-Fetch bei jedem Request
- `Cache-Control: s-maxage=60, stale-while-revalidate=300` via `Astro.response.headers`
- `coingeckoFetcher.ts` mit 5s `AbortSignal.timeout()` · Try/Catch · JSON-Fallback bei API-Fehler · kein Auth nötig
- `wirtschaftResolver.ts` für statische Indizes + News aus `wirtschaft.json`
- 4 Komponenten in `src/components/wirtschaft/`: KryptoHero · IndizesGrid · WirtschaftsNews · TradeSetupsPlaceholder
- Live-Verifikation: BTC $81'096 mit "LIVE · 12:24 CEST"-Stempel echte CoinGecko-Daten

### Erkenntnisse
- **Astro v6 Hybrid-SSR funktioniert sauber.** `output: 'static'` (Default) + `adapter: vercel()` + `export const prerender = false` per-Page ist der korrekte Ansatz in Astro v6 — kein `output: 'hybrid'` mehr nötig (deprecated). Build-Mode zeigt "server" sobald eine SSR-Page existiert.
- **`AbortSignal.timeout()` ist Node 17.3+.** Mit Astro v6 auf Node 22 funktioniert das problemlos — kein separates `setTimeout`/`clearTimeout`-Pattern nötig.
- **toLocaleString('de-CH') auf dem Vercel-Server.** Funktioniert mit Full-ICU in Node 22/Vercel-Runtime: Apostroph als Tausenderpunkt korrekt rendert.
- **Fallback-Pattern als Vorlage.** Exakt das gleiche Try/Catch-Muster wird für Open-Meteo (Slice 2.3.3) und iCal (Slice 2.3.4) wiederverwendet.

### Offene Pendenzen
- Slice 2.3.3 als Nächstes (/wetter Slim · 8 Wetter-Symbol-SVGs · Open-Meteo · Foto-Spots)
- CoinGecko-Rate-Limit (10–30/Min Free Tier) bei späteren Concurrent-Visitors prüfen
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `astro.config.mjs` (Vercel-Adapter)
- `.gitignore` (.vercel/ hinzugefügt)
- `package.json` + `package-lock.json` (@astrojs/vercel)
- `src/data/wirtschaft.json` (neu)
- `src/lib/coingeckoFetcher.ts` (neu)
- `src/lib/wirtschaftResolver.ts` (neu)
- `src/components/wirtschaft/KryptoHero.astro` (neu)
- `src/components/wirtschaft/IndizesGrid.astro` (neu)
- `src/components/wirtschaft/WirtschaftsNews.astro` (neu)
- `src/components/wirtschaft/TradeSetupsPlaceholder.astro` (neu)
- `src/pages/wirtschaft.astro` (modifiziert · SSR + DetailPage)
- `_pendenzen.md` (Slice 2.3.2 abgehakt)
- `SESSION_LOG.md` (Update 15)

---

## 26-05-13 (Update 14) · Slice 2.3.1 implementiert

### Was gemacht
- `sources.json` mit 7 Quellen-Einträgen: CoinGecko · Cowork (statisch) · Open-Meteo · SunCalc · Astronomie-Highlights · Google Calendar (iCal) · Cowork (kuratiert)
- `sourceFilter.ts` mit `getSourcesFor(modul)` und `getAllSources()` · TypeScript strict · keine any
- `SourceStempel.astro` mit externen Links (target="_blank" rel="noopener") und Use-Beschreibungen · conditional: rendert nur wenn Einträge vorhanden
- `DetailPage.astro` als gemeinsames Layout für /wirtschaft · /wetter · /news · /kalender · wraps Magazine.astro · Back-Link "← Zurück zum Cover" · optionale Eyebrow · Fraunces-H1 · Hairline-Separator · SourceStempel am Ende
- `/archiv.astro` auf DetailPage umgestellt · bewusst permanent da Phase 3 Content Collections direkt auf diesem Layout aufbaut · modul="archiv" → SourceStempel rendert korrekt nichts (kein Eintrag)

### Erkenntnisse
- **SourceStempel conditional-leer ist korrektes Verhalten.** `modul="archiv"` liefert leere Liste → `{sources.length > 0 && ...}` blendet Stempel aus. Kein Spezialfall nötig, das Muster skaliert sauber auf jedes Modul.
- **DetailPage-`<title>` interpoliert.** `${title} · Mario's HQ` ergibt z.B. "Archiv · Mario's HQ" — konsistentes Browser-Tab-Pattern für alle Detail-Pages gesetzt.
- **Dark-Mode via `data-theme` · nicht `prefers-color-scheme`.** Site nutzt localStorage-Toggle, nicht CSS Media Query. Preview-Verifikation via `preview_eval: document.documentElement.dataset.theme = 'dark'` statt `colorScheme`-Option.

### Offene Pendenzen
- Slice 2.3.2 als Nächstes (/wirtschaft Slim · Krypto-Hero live via CoinGecko · Indizes · News · Trade-Setups-Placeholder)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen (`<details>`-Stolperstein · Worktree-Falle in SKILL.md)

### Files dieser Session
- `src/data/sources.json` (neu)
- `src/lib/sourceFilter.ts` (neu)
- `src/components/SourceStempel.astro` (neu)
- `src/layouts/DetailPage.astro` (neu)
- `src/pages/archiv.astro` (auf DetailPage umgestellt)
- `_pendenzen.md` (Slice 2.3.1 abgehakt)
- `SESSION_LOG.md` (Update 14)

---

## 26-05-13 (Update 13) · Phase 2.3 Konsolidierung + Spec

### Was gemacht
- Strategische Diskussion: Phase 2.3/2.4/2.5/2.6 zu einer konsolidierten Phase 2.3 · Detail-Pages Slim zusammengefasst (Site-First-Tiefe-Later-Prinzip)
- Architektur-Entscheidungen pro Detail-Modul getroffen:
  · Krypto via CoinGecko-API (live)
  · Wetter via Open-Meteo (live, gratis)
  · Kalender via iCal-Geheim-URL (Wegwerf-Code bis Phase 8)
  · 8 Wetter-Symbole als sumi-e SVGs
  · 4 Aargau-Foto-Spots mit Picker-Algorithmus
  · Astronomie via SunCalc lokal + hartcodierte 2026-Events
  · News kuratiert ab Phase 5 via Cowork
- Spec-File `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` committed
- Out-of-Band-Edit Commit d1b88a6 nachgeloggt (Site-Footer Phase 2.1 → 2.2 Korrektur nach Phase-2.2-Abschluss)

### Erkenntnisse
- **Konsolidierung war richtig.** Volle Vertiefung pro Modul macht ohne Charts (Phase 4) und Cowork-Daten (Phase 5) nur Mockup-Arbeit. Slim-Layouts jetzt geben dem HQ als Ganzes Gestalt.
- **iCal statt OAuth für Kalender im MVP.** OAuth-Setup ist 200+ Zeilen, eigene Slice-Last, ENV-Management. iCal-URL als Wegwerf-Brücke bis Phase 8 (Voll-Kalender).
- **Out-of-Band-Edit-Pattern erkannt.** Spontane Auto-Edit-Pop-ups in Claude Code können Logging-Lücken erzeugen. Künftig vorsichtig sein.

### Offene Pendenzen
- Slice 2.3.1 als Nächstes (Foundation für Detail-Pages)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen (`<details>`-Stolperstein, Worktree-Falle in SKILL.md)
- Cowork-Prompt-Schema für JSON-Befüllung ab Phase 5 definieren (eigene Spec wahrscheinlich)

### Files dieser Session
- `docs/PHASE-2.3-DETAIL-PAGES-SPEC.md` (neu)
- `_pendenzen.md` (Phase-2.3-Konsolidierung)
- `SESSION_LOG.md` (Update 13)

---

## 26-05-13 (Update 12) · Slice 2.2.5 + Phase 2.2 Abschluss

### Was gemacht
- CoverFooter mit Generierungs- und Live-BTC-Stempel
- src/lib/generierung.ts als zentrale Quelle (statisch in MVP, Phase 5 liefert echte Timestamps)
- Dark-Mode-Polish an drei Komponenten:
  · HeroImage: hardcodiertes Licht-Gradient (#EEEBE3) war helles Rechteck gegen dark-bg — auf #1E1E1E/#161616 umgestellt, Opacities leicht abgesenkt
  · EventBanner: background von 0.06 auf 0.12 — war fast unsichtbar auf sumi-900
  · MacroCard: separater hq-pulse-border-dark Keyframe (0.28/0.65 statt 0.18/0.55)
- Volltest Light/Dark · 375px/1280px · Conditional-Tests · Console sauber

### Erkenntnisse
- Viewport-Höhe für Preview-Tests relevant: bei 800px-Höhe und 1380px-Seite sieht man nur Teile → Taller-Viewport (1500px+) macht Volltest in einem Screenshot möglich
- `transferSize === 0` in performance.getEntriesByType('resource') ist kein 404 — das sind 304-Cached-Responses im Vite-Dev-Server
- Dark-Mode-Background für SVG via `:root[data-theme="dark"] .hero-image { background: ... }` in Astro-scoped Style funktioniert sauber — Astro scopet nur den .hero-image-Selektor, :root bleibt global
- Phase 2.2 ist die erste Phase mit echtem Editorial-Charakter · 5 Slices als Increment-Pattern bewährt

### Offene Pendenzen
- Phase 2.3 startet · /wirtschaft als Detail-Page (Krypto-Hero, Macro-Timeline, Indizes, News-Wirtschaft)
- Aufräum-Tasks aus Phase 2.1: <details>-Stolperstein + Worktree-Falle in SKILL.md dokumentieren
- Site-Footer noch auf "Phase 2.1" — sollte auf "Phase 2.2" nachgeführt werden (kleiner Aufräum-Task)

### Files dieser Session
- `src/lib/generierung.ts` (neu)
- `src/components/CoverFooter.astro` (neu)
- `src/pages/index.astro` (modifiziert · Footer integriert)
- `src/components/HeroImage.astro` (Dark-Mode-Polish)
- `src/components/EventBanner.astro` (Dark-Mode-Polish)
- `src/components/MacroCard.astro` (Dark-Mode-Polish)
- `_pendenzen.md` (Slice 2.2.5 abgehakt · Phase 2.3 als aktuelle Phase)
- `SESSION_LOG.md` (Update 12)

---

## 26-05-13 (Update 11) · Slice 2.2.4 implementiert

### Was gemacht
- krypto.json + macro.json + news.json statische Stubs
- kryptoResolver.ts + macroResolver.ts + newsResolver.ts (Pattern 1:1 aus 2.2.3)
- KryptoCard mit Fraunces-Preis · toLocaleString('de-CH') Schweizer Apostroph-Tausenderpunkt · Delta in Vermillon bei Minus
- MacroCard mit conditional Event-Pulse-Animation (gekoppelt an eventResolver.ts aus Slice 2.2.2) · prefers-reduced-motion-Schutz · Indizes-Strip mit flat/+/−-Format im Frontmatter berechnet
- NewsCard mit 3 Headlines-Stack · last-child margin-0
- index.astro: .supporting-Grid repeat(3, minmax(0, 1fr)) · Mobile-Stack unter 768px
- Conditional-Test via events.json-Datumswechsel bestanden · Pulse + Stempel verschwinden korrekt

### Erkenntnisse
- `@keyframes` in Astro-scoped `<style>` werden korrekt kompiliert — Animationsname wird mit data-astro-cid-Hash gescopert, Referenz im gleichen Block funktioniert automatisch
- prefers-reduced-motion via `CSSMediaRule.conditionText` in den kompilierten Stylesheets verifizierbar — kein manueller macOS-System-Switch nötig für CI-nahe Verifikation
- `border: 1.5px solid transparent` als Default-State hält Card-Grösse stabil wenn Event-Aktiv-Border erscheint — kein Layout-Shift

### Offene Pendenzen
- Slice 2.2.5 als letzter Cover-Slice (CoverFooter · Polish · Dark-Mode-Verbesserungen · Mobile-Volltest)
- Live-CoinGecko-API, MeteoSwiss, RSS-Aggregator kommen spätere Phasen

### Files dieser Session
- `src/data/krypto.json` (neu)
- `src/data/macro.json` (neu)
- `src/data/news.json` (neu)
- `src/lib/kryptoResolver.ts` (neu)
- `src/lib/macroResolver.ts` (neu)
- `src/lib/newsResolver.ts` (neu)
- `src/components/KryptoCard.astro` (neu)
- `src/components/MacroCard.astro` (neu)
- `src/components/NewsCard.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.4 abgehakt)
- `SESSION_LOG.md` (Update 11)

---

## 26-05-13 (Update 10) · Slice 2.2.3 implementiert

### Was gemacht
- wetter.json + kalender.json mit statischen Stubs
- wetterPicker.ts + kalenderResolver.ts (Pattern aus 2.2.2)
- WetterCard.astro mit custom sumi-e SVG-Symbol (var(--fg) für Dark-Mode-Auto-Anpassung, Wolke via var(--bg-card) als Painters-Model-Clip)
- KalenderCard.astro mit Termin-Liste + Wochen-Strip
- index.astro: co-heroes Grid minmax(0,1.7fr)/minmax(0,1fr), Mobile stackt
- Beide Cards mit Vermillon-Eyebrows

### Erkenntnisse
- Astro-Dev-Server kann nach mehrfachen index.astro-Edits alten CSS-Cache halten — `display: grid` greift erst nach Server-Neustart. Symptom: eval zeigt `display: block`. Fix: Server killen + preview_start neu aufrufen.
- SVG `fill="var(--bg-card)"` für Wolken-Masking funktioniert in inline SVG ohne Extra-Aufwand — Dark-Mode-Auto-Switch kostenfrei über semantische Tokens.
- `minmax(0, 1.7fr) minmax(0, 1fr)` statt plain `1.7fr 1fr` verhindert Grid-Overflow bei langem Card-Inhalt.

### Offene Pendenzen
- Slice 2.2.4 als Nächstes (Krypto · Macro · News Cards · 3er-Reihe)
- Wetter-Symbol-Set + MeteoSwiss-Anbindung kommt Phase 2.4
- Google-Calendar-Read-Only kommt Phase 2.6
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/wetter.json` (neu)
- `src/data/kalender.json` (neu)
- `src/lib/wetterPicker.ts` (neu)
- `src/lib/kalenderResolver.ts` (neu)
- `src/components/WetterCard.astro` (neu)
- `src/components/KalenderCard.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.3 abgehakt)
- `SESSION_LOG.md` (Update 10)

---

## 26-05-13 (Update 9) · Slice 2.2.2 implementiert

### Was gemacht
- geschichte.json mit 5 Demo-Einträgen (gemischte Themen entsprechend Marios Bias)
- events.json mit Powell-Demo-Event für heute
- geschichtePicker.ts und eventResolver.ts (Pattern analog zu zitatePicker.ts aus Slice 2.2.1)
- GeschichteStrip.astro (Pattern-Klon vom Zitat-Strip mit Eyebrow in Tinte-Mittel statt Vermillon)
- EventBanner.astro mit conditional Rendering
- index.astro integriert beide neuen Komponenten

### Erkenntnisse
- `(match as Event) ?? null` im Spec-Code ist TypeScript-Strict-Problem: `undefined as Event` ist fragwürdige Assertion. Sichere Lösung: ternäres `match ? (match as Event) : null`.
- Conditional-Test via hartkodiertem Datum bestätigt: CSS-Klasse bleibt im `<style>`-Block, aber kein DOM-Element wenn Event null — korrektes Verhalten.
- `grep -c` zählt Zeilen, nicht Vorkommen — für Conditional-Test `class="event-banner"` statt `.event-banner` als Suchmuster nutzen.

### Offene Pendenzen
- Slice 2.2.3 als Nächstes (Wetter+Foto Card · Kalender Card · Co-Heroes)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/geschichte.json` (neu)
- `src/data/events.json` (neu)
- `src/lib/geschichtePicker.ts` (neu)
- `src/lib/eventResolver.ts` (neu)
- `src/components/GeschichteStrip.astro` (neu)
- `src/components/EventBanner.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Slice 2.2.2 abgehakt)
- `SESSION_LOG.md` (Update 9)

---

## 26-05-13 (Update 8) · Slice 2.2.1 implementiert

### Was gemacht
- Daten-Layer: zitate.json (11 Zitate), ausgabe.ts (Counter + KW + Wochentag + Monat), zitatePicker.ts (deterministische Tages-Auswahl)
- Drei neue Astro-Komponenten: HeroImage (sumi-e Berg-SVG), CoverHeader (Eyebrow + Hero-Datum), Zitat (Tages-Strip mit Vermillon-Eyebrow)
- index.astro: Mini-Stub ersetzt durch echtes Layout
- _pendenzen.md: Phase 2.2 in 5 Slices umgegliedert

### Erkenntnisse
- DateDisplay.astro aus Phase 2.1 nicht wiederverwendet — andere Grösse (44px vs. Display-Scale) und andere opsz (96 vs. 144). Build-time-computed ist für SSG + tägliche Rebuilds die richtige Wahl.
- SVG-CSS aus inline-style in `<style>`-Block ausgelagert — Media-Query ohne `!important` möglich.
- Terminal-Verifikation des Ausgabe-Counters vor Komponenten-Build: sauberes Vorgehen, deckt Logik-Bugs vor UI-Arbeit auf.

### Offene Pendenzen
- Slice 2.2.2 als Nächstes (Geschichte-Strip + Event-Banner)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `src/data/zitate.json` (neu)
- `src/lib/ausgabe.ts` (neu)
- `src/lib/zitatePicker.ts` (neu)
- `src/components/HeroImage.astro` (neu)
- `src/components/CoverHeader.astro` (neu)
- `src/components/Zitat.astro` (neu)
- `src/pages/index.astro` (modifiziert)
- `_pendenzen.md` (Phase 2.2 Slice-Umgliederung)
- `SESSION_LOG.md` (Update 8)

---

## 26-05-13 (Update 7) · Phase 2.2 Spec dokumentiert

### Was gemacht
- Strategie-Chat zu Phase 2.2 Cover-Page durchgeführt
- Skizze A v3 als visuelle Referenz iteriert (3 Versionen)
- Architektur-Entscheidung: Modell C (Hybrid mit Live-Inseln)
- 5 Slices definiert (2.2.1 bis 2.2.5)
- Spec-File docs/PHASE-2.2-COVER-SPEC.md committed

### Erkenntnisse
- Modell C ist editorial-konform · Magazin-Charakter bleibt, kritische Daten sind live · kein Update-Suffix nötig
- Spec-File als Brücke zwischen claude.ai-Sessions · Token-Limit in Strategie-Chats macht Repo-Dokumente wichtig

### Offene Pendenzen
- Slice 2.2.1 implementieren (Eyebrow, Hero-Bild, Zitat)
- Aufräum-Tasks aus Phase 2.1 weiterhin offen

### Files dieser Session
- `docs/PHASE-2.2-COVER-SPEC.md` (neu)
- `_pendenzen.md`
- `SESSION_LOG.md` (Update 7)

---

## 26-05-13 (Update 6) · Voll-Kalender als Post-MVP-Modul dokumentiert

### Was gemacht

**Strategische Diskussion: Voll-Kalender als eigenes Modul**
- Phase 2.6 bleibt Read-Only-Kalender (Google Calendar API, kein Write-Zugriff)
- Voll-Kalender (bidirektionaler Google-Sync, Drag-Drop, Quick-Add) als eigenständiges Post-MVP-Modul definiert
- Akiflow und Routine als visuelle Referenz für UI/UX festgehalten
- Drei Docs-Files aktualisiert: `_pendenzen.md`, `_projekt.md`, `SESSION_LOG.md`

### Erkenntnisse

- **Akiflow/Routine als Benchmark:** Nicht das Feature-Set kopieren — die Reibungslosigkeit als Massstab nehmen. Voll-Kalender lohnt sich nur, wenn er spürbar besser als der native Kalender ist.
- **Read-First-Reihenfolge bewährt sich:** Phase 2.6 Read-Only zuerst aufbauen. Wenn die API-Integration sitzt, ist Voll-Kalender ein inkrementeller Write-Layer — kein Rewrite.
- **Strategie vor Code:** Modul-Grenzen jetzt klären spart später Architektur-Schulden. Der Trigger für Voll-Kalender bleibt offen — bewusst, nicht vergessen.

### Offene Pendenzen

- Phase 2.2 · Cover-Page Layout startet als nächstes
- SKILL.md: Worktree-Falle + `<details>`-Shadow-Box-Modell dokumentieren (bei nächstem `docs:`-Commit)

### Files dieser Session

- `_pendenzen.md` (Voll-Kalender in Nordstern, Phase 7+, Offene Fragen)
- `_projekt.md` (Modul-Architektur, Entscheidungs-Tabelle)
- `SESSION_LOG.md` (dieser Eintrag)

---

## 26-05-12 (Update 5) · Phase 2.1 live · Layout-Foundation komplett

### Was gemacht

**Drei Commits in einem produktiven Abend-Block:**
- Commit 1 (21eda17): Layout-Foundation — Header, Navigation, ThemeToggle, DateDisplay, Footer, PhasePlaceholder, Magazine-Refactor, Cover-Mini-Stub
- Commit 2 (f7e2261): 8 Platzhalter-Pages für MVP- und Phase-7-Module
- Push zu GitHub, Vercel Auto-Deploy auf mario-hq-qc6f.vercel.app

**Wichtige Architektur-Entscheidung mitten in Phase 2.1:**
- Erster Ansatz mit `<details>` als Layout-Wrapper scheiterte am Browser-Shadow-Box-Modell
- Diagnose: `<details>` exponiert intern einen anonymen Wrapper, der `<summary>` und alle anderen Kinder trennt; Grid-Items waren nicht die direkten DOM-Kinder
- Lösung: Wechsel zu Button + JS-Toggle (`aria-expanded`, 6 Zeilen Inline-JS)
- `:has()`-Selektor für robusten Mobile-Collapse
- Cross-Browser robust, kein UA-Shadow-DOM-Stress

### Erkenntnisse

- **Plan-First-Regel bewährt sich:** Sonnet 4.6 hat den `<details>`-Bug bei der Browser-Verifikation entdeckt, vor dem Commit. Saubere Diagnose statt blinden Fix-Versuchen.
- **Spec-Treue vs. Pragmatismus:** `<details>` ist semantisch für Inhalt-Disclosure (FAQ, Spoiler), nicht für Navigations-Layout. Die richtige Wahl ist manchmal der Standard-Button mit `aria-expanded`.
- **Vermillon-Quote sehr sparsam:** Active-Underline alleine = 0.006% Page-Area. Drei-Prozent-Regel komfortabel eingehalten.
- **Worktree-Falle besteht:** Jeder bash-Call muss `cd /Users/mariomacstudio/Developer/mario-hq && ...` chainen. Claude Code rutscht sonst in `.claude/worktrees/...` zurück.
- **DRG-Tokens funktionieren wie geplant:** Fraunces × Inter × JetBrains Mono, Washi/Sumi/Papier/Vermillon — alles in CSS-Variablen sauber. Theme-Switch ist eine einzige `data-theme`-Mutation.

### Offene Pendenzen

- SKILL.md: Worktree-Falle als bekannten Stolperstein dokumentieren (bei nächstem `docs:`-Commit)
- SKILL.md: `<details>`-Shadow-Box-Modell als „bewusst verworfene Pattern" dokumentieren
- Phase 2.2 vorbereiten: Cover-Page als echte Tagesübersicht mit 5 Modul-Cards

### Files dieser Session

- Commit 1: 6 neue Komponenten + 3 modifizierte (Magazine, index, global.css)
- Commit 2: 8 neue Platzhalter-Pages
- Update 5 in SESSION_LOG.md (dieser Eintrag)
- Phase-2.1-Abschluss in _pendenzen.md

---

## 26-05-12 (Update 4) · Repo-Rename zu `mario-hq`

### Was gemacht
- GitHub-Repo `Taljy/mario-hq` erstellt (statt `morgenbriefing`)
- Lokaler Ordner umbenannt: `~/Developer/morgenbriefing/` → `~/Developer/mario-hq/`
- Alle Meta-Files aktualisiert: package.json, SKILL.md, _projekt.md, _pendenzen.md
- Historische Referenzen in `docs/UEBERGABE-morgenbriefing.md` und `_pendenzen.md` (Erledigt-Sektion) bleiben unverändert als Archiv

### Erkenntnis
- Konsequente Umbenennung jetzt — bevor GitHub-Push und Vercel-Setup. Pivot zum richtigen Zeitpunkt: später wäre teurer.
- Repo-Name matched jetzt Produktname „Mario's HQ".

---
## 26-05-12 (Update 3) · Mario's HQ · Strategischer Pivot von Briefing zu Cockpit

### Was gemacht

**Strategische Reflexion nach Phase-1-Abschluss**
Mario fragt sich, ob das Projekt mehr werden sollte als ein tägliches Briefing — ein zentrales Steuerungstool, das fragmentierte Apps konsolidiert. Detaillierte Bestandsaufnahme aller aktuell genutzten Tools, dann strategischer Cut:

- **Hauptmodul:** Wirtschafts-Briefing (Krypto, Macro, Märkte, News) — höchster täglicher Nutzwert
- **MVP-Module Phase 2:** Cover + Wirtschaft + Wetter/Foto + News + Kalender (Read-Only) + Archiv
- **Phase 6+:** Briefing-Erweiterungen (Trade-Setups, Bike-Wetter, News-Aggregator)
- **Phase 7+:** HQ-Lebensbereiche (Habits, Workout, Zeiterfassung)
- **Bewusst draussen:** Essen, Shopping, Ziele, Lernen — gehören in Obsidian oder existierende Apps

**Drei Schlüssel-Entscheidungen**
1. **Name:** Mario's HQ (Repo bleibt `morgenbriefing`, UI/Branding pivotiert) — *später revidiert in Update 4: Repo wurde umbenannt zu `mario-hq`*
2. **Aufgaben-Architektur:** 4-Typen-Trennung — Cal (termingebunden) · Obsidian (Notizen) · _pendenzen.md (Code) · Streaks (Habits). HQ zeigt Read-Only an, bearbeitet wird am Quell-Ort.
3. **Phase 2 Schwerpunkt:** Wirtschaft + Wetter/Foto parallel produktionsreif, statt nacheinander

**Phase 2 neu strukturiert in 6 Sub-Phasen**
- 2.1 Informations-Architektur & Navigation
- 2.2 Cover-Page Layout
- 2.3 /wirtschaft Vertiefung
- 2.4 /wetter Vertiefung
- 2.5 /news handgepflegt
- 2.6 /kalender Read-Only

**Files aktualisiert**
- `_projekt.md` komplett neu — Mario's HQ als Cockpit, Modul-Übersicht, Read-Only-Prinzip, 4-Typen-Aufgaben-Architektur
- `_pendenzen.md` komplett neu — neue Nordstern-Sektion, Phase 2 in 6 Sub-Phasen, klare Abgrenzung MVP vs. später vs. draussen
- `SESSION_LOG.md` (dieser Eintrag)

### Erkenntnisse

- **Reality-Check via Bestandsaufnahme war wertvoll.** Beim Aufschreiben aller Apps wurde klar: viele Bereiche gehören nicht ins HQ (Essen, Shopping). Andere brauchen klare Quell-Hoheit (Habits → Streaks, Notizen → Obsidian).
- **Read-Only-Prinzip ist die wichtigste Entscheidung.** Vermeidet die Synchronisations-Hölle, die jedes Cockpit-Projekt killt. HQ wird zum Fenster auf bestehende Quellen, nicht zur weiteren Quell-App.
- **HQ-Pivot zur richtigen Zeit.** Vor Phase 2 ist der Moment für strategische Klarheit. Phase 2 würde Multi-Page-Routing aufbauen — wenn jetzt sechs Routes geplant sind statt zwei, ändert das die Architektur massiv. Später Refactoring wäre teurer.
- **Pragmatischer Scope-Cut.** Mario hat selbst formuliert „eins nach dem anderen einbauen, viele Module erstmal nur als Platzhalter." Genau richtiges Mantra für ein Solo-Projekt mit Tagesjob.
- **Wirtschaftsblock ist das wertvollste Modul.** Mario sagt das selbst: bereitet ihn auf den Trading-Tag vor. Das treibt die Energie-Verteilung in Phase 2.

### Offene Pendenzen

- Aktualisierte `_projekt.md` und `_pendenzen.md` ins Repo kopieren (ersetzt die alten)
- Mini-Commit: `docs: mario's HQ pivot · projekt und pendenzen aktualisiert`
- Dann Aufräum-Tasks (SKILL-Update auf v6, GitHub-Push, Vercel-Setup)
- Dann Phase 2.1 starten · Information-Architektur & Navigation

### Files dieser Session

- `_projekt.md` (komplett überarbeitet)
- `_pendenzen.md` (komplett überarbeitet)
- `SESSION_LOG.md` (Eintrag ergänzt)

---
## 26-05-12 (Update 2) · Visual-Identität-Pivot zu Studio Da Rugna

### Was gemacht

**Strategische Wende vor dem ersten Astro-Setup**
- Mario entschied: visuelle Identität nicht eigenständig-Editorial, sondern **Studio-Da-Rugna-Familie** — Marken-Kohärenz über alle seine Projekte
- DRG-Design-System (`colors_and_type.css`, `tailwind.tokens.js`, `SKILL.md`) als Token-Basis integriert
- Token-Mapping: Cream → Washi · Ink → Sumi-900 · Crimson → Vermillon · Newsreader → Inter
- DRG-Hard-Rules übernommen (Vermillon max 3%, no marketing fluff, no bouncy animations)
- Emoji-Regel-Konflikt geklärt: DRG-strikt für UI-Chrome, aber im Briefing-Content erlaubt (privates Tool, keine Kunden-Sicht)
- Dark Mode mitgenommen (DRG hat ihn fertig)

**Files aktualisiert**
- `SKILL.md` · komplett neu mit DRG-Tokens, Inter statt Newsreader, DRG-Anti-Patterns
- `_projekt.md` · Sektion „Visuelle Identität" umgeschrieben · Entscheidungs-Tabelle erweitert
- `SESSION_LOG.md` · dieser Eintrag

**Claude Code drüben war pausiert** seit dem Astro-Plan — bewusst gestoppt vor Schritt 1, um nicht mit falschen Tokens loszulegen.

### Erkenntnisse

- **Pivot zur richtigen Zeit.** Vor dem ersten `npm create astro` ist der Stopp-Moment richtig — kein nachträgliches Refactoring von Tokens nötig.
- **DRG-System ist Premium-Qualität.** Type-Scale mit clamp(), opsz-Achse für Fraunces, zwei Schatten-Stops, durchdachte Light/Dark-Tokens. Mario hat hier nicht halb-improvisiert.
- **Inter statt Newsreader ist mutiger Move.** Wechsel Serif-Body → Sans-Body verändert den Charakter spürbar. Funktioniert: Display-Serif × Sans-Body ist FT-Weekend/Monocle-Standard.
- **Hard-Rule-Konflikt sauber gelöst.** DRG's „no emoji" für Kunden-Touchpoints macht Sinn — Mario's „privates Tool"-Argument macht die Briefing-Ausnahme legitim. Wichtig: im UI-Chrome trotzdem strikt.

### Offene Pendenzen

- Aktualisierte Files (`SKILL.md`, `_projekt.md`) ins Repo kopieren (ersetzt die alten)
- Claude Code drüben mit GO-Prompt starten (Phase 1 · Astro-Setup mit DRG-Tokens)
- `_pendenzen.md` bleibt unverändert (Phasen-Struktur identisch, nur Token-Bezeichnungen darin)

### Files dieser Session

- `SKILL.md` (überarbeitet)
- `_projekt.md` (überarbeitet)
- `SESSION_LOG.md` (Eintrag ergänzt)

---

> Chronologisch, neueste oben. Pro Session: Datum, Was gemacht, Erkenntnisse, Offene Pendenzen.

---

## 26-05-12 · Setup-Phase 1 + Meta-Dokumentation

### Was gemacht

**Strategische Entscheidungen**
- Architektur evaluiert · drei Niveaus diskutiert (Daily-HTML / Magazine-App / Static Site)
- **Niveau 3 gewählt:** Astro + Vercel · echte Multi-Page-Site mit Auto-Deploy
- Tech-Stack festgelegt: Astro v5 · TypeScript · Tailwind v4 · ECharts · Vercel
- Visuelle Identität: Editorial-Look (Fraunces + Newsreader), eigenständig — nicht DREK-Brand

**Setup**
- Voraussetzungs-Check: Node v24, npm v11, Git 2.50 vorhanden · Brew + VS Code + Claude Code fehlten
- Homebrew 5.1.11 installiert · PATH konfiguriert in `~/.zprofile`
- VS Code 1.115.0 existierte bereits · `code`-CLI via Command Palette verknüpft
- Claude Code 2.1.139 via native installer · PATH-Fix für `~/.local/bin` in `~/.zshrc`

**Konventionen geklärt**
- Web-Projekt-Konventionen aus DREK destilliert (separater Chat im DREK-Projekt)
- `WEBPROJEKT-KONVENTIONEN.md` als Referenz importiert
- Setup-Plan an Konventionen angepasst: Vercel statt Cloudflare Pages, `~/Developer/` als Pfad, TypeScript ja

**Meta-Dokumente erstellt**
- `_projekt.md` · Vision, Stack, Architektur, Kontext über Mario
- `_pendenzen.md` · 5-Phasen-Roadmap mit aktuellem Stand
- `SKILL.md` · Konventionen für Claude Code in diesem Repo
- `SESSION_LOG.md` · dieses File

### Erkenntnisse

- **Konventionen-File via Schwester-Chat war Gold wert.** Spart in Zukunft jedes Mal die Frage „wie machst du das normalerweise". `WEBPROJEKT-KONVENTIONEN.md` als zentrale Referenz.
- **Niveau 3 statt Magazine-App war richtige Wahl.** Mario will lernen, das ist die Investition wert. Die fünf Phasen sind klar abgegrenzt, jede liefert eigenständigen Wert.
- **Editorial-Identität bewusst gewählt, nicht DREK-Brand übernommen.** Das Briefing ist ein persönliches Projekt, eigene Ästhetik macht Sinn.
- **Tailwind v4 ist neu für Astro-Setup**, aber für Mario konsistent mit DREK-Projekten — `@theme` in CSS statt `tailwind.config.js`.

### Offene Pendenzen

- Drei Mario-Fragen warten: Pfad, Repo-Name, Domain-Strategie (siehe `_pendenzen.md`)
- GitHub-Repo anlegen (Owner: Taljy, Public, ohne Init-Files)
- Astro-Projekt initialisieren mit `npm create astro@latest`
- Erste Live-URL auf Vercel
- Meta-Files ins Repo-Root commiten

### Files dieser Session

- `WEBPROJEKT-KONVENTIONEN.md` *(aus Schwester-Chat)*
- `_projekt.md`
- `_pendenzen.md`
- `SKILL.md`
- `SESSION_LOG.md`

---

*Eintrag-Template für nächste Session:*

```markdown
## JJ-MM-TT · Session-Titel

### Was gemacht
- ...

### Erkenntnisse
- ...

### Offene Pendenzen
- ...

### Files dieser Session
- ...
```
