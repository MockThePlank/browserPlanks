# Browser Planks - Slide Demo

[![Pages](https://img.shields.io/badge/Pages-live-brightgreen)](https://MockThePlank.github.io/browserPlanks/)
[![Last commit](https://img.shields.io/github/last-commit/MockThePlank/browserPlanks)](https://github.com/MockThePlank/browserPlanks/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-ESM%20strict-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/MockThePlank/browserPlanks)](https://github.com/MockThePlank/browserPlanks/blob/main/LICENSE)

Kleine, framework-freie Präsentations-App mit animierten Übergängen, 5 Beispiel-Slides und drei Transition-Typen.

## Start

- Öffne `index.html` direkt im Browser **oder** starte einen kleinen Server im Projektordner, z. B. `python3 -m http.server 3000` und rufe `http://localhost:3000` auf.
- Bei Änderungen am Code `npm run build` ausführen; der Browser lädt die kompilierten ES-Module aus `dist/app.js`.
- Navigation: `←/→`, `PageUp/PageDown`, Klick auf Bühne, Buttons oder Hash-Link `#/1`, `#/2`, …
- Fokus: Bühne ist `tab`-fokussierbar; Taste `f` setzt den Fokus erneut.

## Architektur

- `slides/`: eine Datei pro Slide (`intro.ts`, `architecture.ts`, …) plus `slides/index.ts` zum Aggregieren.
- `app.ts`:
  - `SlideRenderer` rendert Templates (Text, Tabelle, Video).
  - `TransitionManager` wendet Transition-Klassen an (`fade`, `slide`, `zoom`) und räumt alte Slides auf.
  - `Deck` kümmert sich um Routing (Hash), Navigation und Fokus/ARIA.
- `styles/styles.css`: Layout (16:9 Bühne), Templates, Transition-Styles.

## Bilder einbinden

- Lege deine Grafiken unter `assets/images/` ab (z. B. `assets/images/logo.png`).
- Du kannst Bilder in `text`- und `table`-Slides einbetten oder den Typ `image` nutzen.

```js
// Bild in einem Text-Slide
export default {
  id: "pic-01",
  type: "text",
  title: "Architektur",
  subtitle: "Blockdiagramm",
  body: "…",
  image: {
    src: "assets/images/arch.png",
    alt: "Blockdiagramm der Architektur",
    caption: "Beispielhafte Architekturübersicht",
  },
  transition: { type: "fade", duration: 500 },
};
```

Titel/Untertitel sind sofort sichtbar, Bild + Caption werden beim ersten Klick angezeigt (wie Body/Table/Video).

## Slides anpassen

Ein Slide ist eine eigene Datei unter `slides/` und exportiert ein Objekt:

```js
export default {
  id: "optional-id",
  type: "text" | "table" | "video" | "image",
  title: "Titel",
  subtitle: "Untertitel",
  body: "Textinhalt",
  table: { columns: [...], rows: [[...], ...] },
  video: { src, autoplay, controls, muted, poster },
  image: { src, alt, caption },
  transition: { type: "fade"|"slide"|"zoom", duration: 500, easing: "ease-in-out" },
};
```

Reihenfolge: `slides/index.js` exportiert ein Array (`export const slides = [intro, ...]`); dort einfach neue Slides importieren/anfügen. Hash-Links nutzen 1-basierte Indizes (`#/3` = drittes Slide).

## Neuen Slide-Typ hinzufügen

1) Lege in `SlideRenderer.templates` eine neue Render-Funktion an, z. B. `quote: (el, slide) => { ... }`.  
2) Weise `type: "quote"` im entsprechenden Slide-Objekt zu.  
3) Ergänze (optional) Styles in `styles/styles.css` für den neuen Typ.

## Transitions erweitern

- Neue CSS-Kombination in `styles/styles.css` (Klassenmuster `t-<name>`, Zustände `is-entering`, `is-active`, `is-leaving`, `is-leaving-active`).
- Im Slide-Objekt `transition: { type: "<name>", duration, easing }` setzen. Ohne Angabe greift das Default (`fade`, 500 ms, ease-in-out).

## Barrierefreiheit & Verhalten

- Bühne hat `role="region"` und `aria-live="polite"`; Titel wird pro Slide aktualisiert.
- Buttons haben aussagekräftige Labels; Fokus sichtbar.
- Keyboard vollständig bedienbar; Video stoppt beim Slide-Wechsel.

## Bekannte Grenzen

- Keine Persistenz von Video-Playhead beim Slide-Wechsel (bewusst: sauberer Reset).
- Google-Font wird remote geladen; offline bitte lokal einbinden oder systemische Schrift nutzen.
