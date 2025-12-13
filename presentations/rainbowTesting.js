import intro from "../slides/intro.js";
import slide01 from "../slides/slide01.js";
import outro from "../slides/outro.js";

// Fünf Text-Slides auf Basis von slide01, jeweils mit anpassbarem Inhalt.
const textSlideOverrides = [
  {
    title: "Why Rainbow Testing?",
    subtitle: "From gut feeling to clear color signals",
    body:
      "Rainbow Testing maps risks and maturity to colors. You immediately see what is burning and what is stable.",
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
  },
  {
    title: "Blue – experiments",
    subtitle: "Validate quickly",
    body:
      "New features start in blue: fast feedback loops with feature flags, canaries, and targeted test paths.",
  },
];

const textSlides = textSlideOverrides.map((slideConfig, index) => ({
  ...slide01,
  ...slideConfig,
  id: slideConfig.id || `rainbow-text-${index + 1}`,
  type: "text",
}));

export const rainbowPresentation = {
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
