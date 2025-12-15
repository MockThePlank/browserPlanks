# Browser Planks - Slide Demo

[![Pages](https://img.shields.io/badge/Pages-live-brightgreen)](https://MockThePlank.github.io/browserPlanks/)
[![Last commit](https://img.shields.io/github/last-commit/MockThePlank/browserPlanks)](https://github.com/MockThePlank/browserPlanks/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-ESM%20strict-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/MockThePlank/browserPlanks)](https://github.com/MockThePlank/browserPlanks/blob/main/LICENSE)

A small, framework-free presentation app with animated transitions, 5 sample slides, and three transition types.

## Getting started

- Open `index.html` directly in your browser **or** run a tiny server in the project root, e.g. `python3 -m http.server 3000` and go to `http://localhost:3000`.
- After code changes run `npm run build`; the browser loads the compiled ES modules from `dist/app.js`.
- Navigation: `←/→`, `PageUp/PageDown`, click on stage, buttons, or hash link `#/1`, `#/2`, …
- Focus: the stage is `tab`-focusable; press `f` to refocus it.
- Switch decks via query param: `?deck=default`, `?deck=rainbow`, `?deck=terminalAI`, or your own id.

## Architecture

- `slides/`: one file per slide (`intro.ts`, `architecture.ts`, …) plus `slides/index.ts` to aggregate.
- `app.ts`:
  - `SlideRenderer` renders templates (text, table, video).
  - `TransitionManager` applies transition classes (`fade`, `slide`, `zoom`) and cleans up old slides.
  - `Deck` handles routing (hash), navigation, and focus/ARIA.
- `presentations/`: registers decks (`presentations/index.ts`) and defines their slide sequences/themes.
- `styles/styles.css`: layout (16:9 stage), templates, transition styles.

## Adding images

- Put your assets under `assets/images/` (e.g. `assets/images/logo.png`).
- You can embed images in `text` and `table` slides or use the `image` type.

```js
// Image in a text slide
export default {
  id: "pic-01",
  type: "text",
  title: "Architecture",
  subtitle: "Block diagram",
  body: "...",
  image: {
    src: "assets/images/arch.png",
    alt: "Architecture block diagram",
    caption: "Example architecture overview",
  },
  transition: { type: "fade", duration: 500 },
};
```

Title/subtitle show immediately; image + caption appear on first click (like body/table/video).

## Editing slides

A slide is a dedicated file under `slides/` that exports an object:

```js
export default {
  id: "optional-id",
  type: "text" | "table" | "video" | "image",
  title: "Title",
  subtitle: "Subtitle",
  body: "Text content",
  table: { columns: [...], rows: [[...], ...] },
  video: { src, autoplay, controls, muted, poster },
  image: { src, alt, caption },
  transition: { type: "fade"|"slide"|"zoom", duration: 500, easing: "ease-in-out" },
};
```

Order: `slides/index.ts` exports an array (`export const slides = [intro, ...]`); import/append new slides there. Hash links use 1-based indices (`#/3` = third slide).

## Adding a new slide type

1) Add a render function to `SlideRenderer.templates`, e.g. `quote: (el, slide) => { ... }`.  
2) Set `type: "quote"` in the slide object.  
3) Add (optional) styles in `styles/styles.css` for the new type.

## Extending transitions

- Add a CSS combo in `styles/styles.css` (class pattern `t-<name>`, states `is-entering`, `is-active`, `is-leaving`, `is-leaving-active`).
- In the slide object set `transition: { type: "<name>", duration, easing }`. Defaults: `fade`, 500 ms, ease-in-out.

## Accessibility & behavior

- Stage has `role="region"` and `aria-live="polite"`; title updates per slide.
- Buttons have meaningful labels; focus is visible.
- Fully keyboard-operable; video stops on slide change.

## Known limitations

- No persistence of video playhead on slide change (intentional reset).
- Google Font is loaded remotely; for offline use, embed locally or use a system font.
