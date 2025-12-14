import intro from "../slides/intro.js";
import slide01 from "../slides/slide01.js";
import outro from "../slides/outro.js";
import type { Presentation, TextSlide } from "../types.js";

// Fünf Text-Slides auf Basis von slide01, jeweils mit anpassbarem Inhalt.
const textSlideOverrides: Array<Partial<TextSlide>> = [
  {
    title: "Why Rainbow Testing?",
    subtitle: "From gut feeling to clear color signals",
    body:
      "Rainbow Testing maps risks and maturity to colors. You immediately see what is burning and what is stable.",
    image: {
      src: "assets/images/rainbow02.png",
      alt: "Rainbow Testing overview",
      caption: "The Rainbow Testing model",
    },
  },
  {
    title: "Red – acute risks",
    subtitle: "Expose blockers fast",
    body:
      "Red marks critical gaps: missing coverage, flaky tests, unstable deployments. Requires immediate action.",
  },
  {
    title: "Yellow – watchlist",
    subtitle: "Fine-tune and monitor",
    body:
      "Yellow means: works, but keep an eye on it. Improve data quality, stabilize mocks, and automate checks.",
    image: {
      src: "assets/images/rainbow01.png",
      alt: "Rainbow Testing color coding",
      caption: "Quality zones in the Rainbow model",
    },
  },
  {
    title: "Green – solid foundation",
    subtitle: "Maintain, don't neglect",
    body:
      "Green signals reliably tested areas. Keep them that way: avoid regressions and refactor regularly.",
    image: {
      src: "assets/images/rainbow03.png",
      alt: "Rainbow Testing green zone",
      caption: "Healthy test coverage in the green zone",
    },
  },
  {
    title: "Blue – experiments",
    subtitle: "Validate quickly",
    body:
      "New features start in blue: fast feedback loops with feature flags, canaries, and targeted test paths.",
    image: {
      src: "assets/images/rainbow03.png",
      alt: "Rainbow Testing blue zone",
      caption: "Innovate safely in the blue zone",
    },
  },
];

const textSlides: TextSlide[] = textSlideOverrides.map((slideConfig, index) => ({
  ...(slide01 as TextSlide),
  ...slideConfig,
  id: slideConfig.id || `rainbow-text-${index + 1}`,
  type: "text",
}));

export const rainbowPresentation: Presentation = {
  id: "rainbow",
  name: "Rainbow Testing",
  slides: [intro, ...textSlides, outro],
  theme: {
    className: "theme-rainbow",          // landet auf <html>
    bodyClassName: "theme-rainbow-body", // optional auf <body>
    stylesheets: ["./styles/theme-rainbow.css"], // zusätzliche Datei laden
  },
  meta: {
    description: "Rainbow Testing Keynote.",
  },
};
