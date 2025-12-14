import { slides as defaultSlides } from "../slides/index.js";
import type { Presentation } from "../types.js";

export const defaultPresentation: Presentation = {
  id: "default",
  name: "MockThePlank Default Deck",
  slides: defaultSlides,
  theme: {
    className: "theme-default",
    stylesheets: [],
  },
  meta: {
    description: "Baseline presentation with text, table, video and image support.",
  },
};
