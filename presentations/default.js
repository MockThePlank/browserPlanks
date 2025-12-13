import { slides as defaultSlides } from "../slides/index.js";

export const defaultPresentation = {
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
