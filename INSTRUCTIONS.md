# Projekt-Working-Notes (Browser Planks)

Kurzer Leitfaden, wie dieses Deck aufgebaut ist und erweitert werden sollte.

## Architektur-Überblick

- **HTML**: `index.html` stellt Bühne (16:9, `stage`), Navigation (Buttons, Klick, Keyboard) und Indikator bereit. `app.js` wird als ES-Modul geladen.
- **Slides**: Unter `slides/` liegt jede Folie als eigenes ES-Modul (`intro.js`, …). `slides/index.js` exportiert `slides` als Array in gewünschter Reihenfolge.
- **App-Logik** (`app.js`):
  - `SlideRenderer`: Renderfunktionen für `text`, `table`, `video`, `image`. Neue Slide-Typen hier ergänzen.
  - `TransitionManager`: Wendet CSS-Transition-Klassen an (`fade`, `slide`, `zoom`) und räumt alte Slides weg.
  - `Deck`: Steuert Routing (Hash `#/n`), Navigation (Keyboard/Click/Buttons), Fokus/ARIA, Medien-Pause.
- **Styles**: `styles.css` enthält Theme, Bühne (16:9, dynamisch passend zu Viewport), Template-Styles und Transition-Klassen (`t-<name>`).

## Wie man Slides ergänzt

1. Neue Datei unter `slides/` anlegen und ein Objekt `export default {...}` definieren (Felder: `id`, `type`, `title`, `subtitle`, `body`, `table`, `video`, `transition`).
2. In `slides/index.js` importieren und ins `slides`-Array einfügen, Reihenfolge = Reihenfolge der Navigation.
3. Falls neuer Typ: Renderfunktion in `SlideRenderer.templates` ergänzen und ggf. Styles in `styles.css`.

### Bilder einbinden

- Bilder liegen unter `assets/images/` (bitte Ordner anlegen und Dateien dort ablegen).
- In `text`- und `table`-Slides per `image`-Objekt referenzieren, z. B.:

  ```js
  image: { src: "assets/images/foo.png", alt: "Beschreibung", caption: "optional" }
  ```

  Das Bild erscheint als dezentes Overlay unten rechts (ca. 1/4 Breite, 85 % Deckkraft) ohne Rahmen und ist sofort sichtbar. Texte/Tabellen bleiben anfänglich ausgeblendet und werden wie bisher per Klick gezeigt.
- Typ `image` rendert das Bild groß im Content-Bereich; hier wird Caption angezeigt, wenn gesetzt.

## Navigation & Routing

- Keyboard: `←/→`, `PageUp/PageDown`, `Home/End`; `f` setzt Fokus zurück auf die Bühne.
- Klick auf freie Fläche der Bühne geht zur nächsten Slide; Buttons links/rechts ebenfalls.
- Hash-Routing: `#/1`, `#/2`, … (1-basiert) setzt die aktuelle Slide.
- Videos werden beim Slide-Wechsel pausiert und zurückgesetzt.

## Transitions

- CSS-Klassen-Muster: `t-<name>` mit Zuständen `is-entering`, `is-active`, `is-leaving`, `is-leaving-active`; nur `transform/opacity`.
- Per Slide konfigurierbar über `transition: { type, duration, easing }`; Default steht in `app.js` (`fade`, 500ms, ease-in-out).
- TransitionManager serialisiert Wechsel, queued schnelle Inputs und entfernt alte Slides vor jedem Übergang, damit keine Artefakte bleiben.

## Layout/Responsive

- Bühne: `width: min(99vw, (100vh - 96px)*16/9)` für minimalen Rand, passt auf 14" und 32".
- Innenabstände der Slides moderat, damit maximale Nutzfläche bleibt; Buttons und Footer schmal gehalten.
- `prefers-reduced-motion` schaltet Transition-Dauer auf 0.

## Barrierefreiheit

- Bühne: `role="region"`, `aria-live="polite"`, `tabindex="0"`, Aria-Label pro Slide.
- Buttons mit `aria-label`; Fokus sichtbar; Videos verwenden Standardcontrols falls nicht deaktiviert.

## Lokale Entwicklung

- Wegen ES-Modul-Imports keinen `file://`-Aufruf nutzen. Kleiner Server reicht: `python3 -m http.server 3000` und `http://localhost:3000` öffnen.

## Erweiterungs-Ideen

- Weitere Templates (Quote, Code, Bildgalerie), Markdown-Parser optional.
- Remote-loses Font-Fallback oder lokale Einbettung.
- Export-Funktion (PDF via print CSS) oder Presenter-Mode mit Notes.
