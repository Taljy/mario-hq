# Mario's HQ · Session Log
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
