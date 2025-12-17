# Project Working Notes (Browser Planks)

Short guide on how this deck is structured and how to extend it.

## Architecture Overview

- **HTML**: `index.html` provides the stage (16:9, `stage`), navigation (buttons, click, keyboard), and indicator. `app.js` is loaded as an ES module.
- **Slides**: Under `slides/` each slide is its own ES module (`intro.js`, ...). `slides/index.js` exports `slides` as an array in the desired order.
- **App Logic** (`app.js`):
  - `SlideRenderer`: Render functions for `text`, `table`, `video`, `image`. Add new slide types here.
  - `TransitionManager`: Applies CSS transition classes (`fade`, `slide`, `zoom`) and clears out old slides.
  - `Deck`: Controls routing (hash `#/n`), navigation (keyboard/click/buttons), focus/ARIA, media pause.
- **Styles**: `styles/styles.css` contains theme, stage (16:9, dynamically fitted to viewport), template styles, and transition classes (`t-<name>`).

## How to Add Slides

1. Create a new file under `slides/` and define an `export default {...}` object (fields: `id`, `type`, `title`, `subtitle`, `body`, `table`, `video`, `transition`).
2. Import it in `slides/index.js` and add it to the `slides` array; order = navigation order.
3. For a new type: add a render function in `SlideRenderer.templates` and, if needed, styles in `styles/styles.css`.

### Adding Images

- Images live under `assets/images/` (create the folder and store files there).
- In `text` and `table` slides, reference via an `image` object, e.g.:

  ```js
  image: { src: "assets/images/foo.png", alt: "Description", caption: "optional" }
  ```

  The image appears as a subtle overlay in the bottom right (about 1/4 width, 85% opacity) without a border and is shown immediately. Texts/tables stay hidden initially and are revealed via click as before.
- Type `image` renders the picture large in the content area; the caption is shown if set.

## Navigation and Routing

- Keyboard: `Left/Right`, `PageUp/PageDown`, `Home/End`; `f` resets focus to the stage.
- Click on free space of the stage goes to the next slide; buttons left/right as well.
- Hash routing: `#/1`, `#/2`, ... (1-based) sets the current slide.
- Videos are paused and reset when switching slides.

## Transitions

- CSS class pattern: `t-<name>` with states `is-entering`, `is-active`, `is-leaving`, `is-leaving-active`; only `transform/opacity`.
- Configurable per slide via `transition: { type, duration, easing }`; default lives in `app.js` (`fade`, 500ms, ease-in-out).
- TransitionManager serializes changes, queues rapid inputs, and removes old slides before each transition so no artifacts remain.

## Layout/Responsive

- Stage: `width: min(99vw, (100vh - 96px)*16/9)` for a small margin, fits 14" and 32".
- Slide padding is moderate to keep maximum space; buttons and footer stay narrow.
- `prefers-reduced-motion` sets transition duration to 0.

## Accessibility

- Stage: `role="region"`, `aria-live="polite"`, `tabindex="0"`, aria label per slide.
- Buttons have `aria-label`; focus visible; videos use default controls unless disabled.

## Local Development

- Because of ES module imports do not use `file://`. A tiny server is enough: `python3 -m http.server 3000` and open `http://localhost:3000`.

## Extension Ideas

- More templates (quote, code, image gallery), optional markdown parser.
- Remote-less font fallback or local embedding.
- Export function (PDF via print CSS) or presenter mode with notes.
