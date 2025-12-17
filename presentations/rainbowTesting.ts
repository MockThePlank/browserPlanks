import { createIntroSlide, createOutroSlide, createTextSlide } from "../slides/templates.js";
import type { Presentation, TextSlide } from "../types.js";

// Fünf Text-Slides auf Basis von slide01, jeweils mit anpassbarem Inhalt.
const textSlideOverrides: Array<Partial<TextSlide>> = [
  {
    title: "Why Rainbow Testing?",
    subtitle: "From gut feeling to clear color signals",
    body:
      "Rainbow Testing maps risks and maturity to colors. You immediately see what is burning and what is stable.",
    image: {
      src: "assets/images/rainbow/rainbowIcon.png",
      alt: "Rainbow Testing overview",
      caption: "The Rainbow Testing model",
      position: "bottom-right",
      size: "lg"
    },
  },
  {
    title: "Red – acute risks",
    subtitle: "Expose blockers fast",
    body:
      "Red marks critical gaps: missing coverage, flaky tests, unstable deployments. Requires immediate action.",
    image: {
      src: "assets/images/rainbow/rainbowIconD.png",
      alt: "Rainbow Testing red zone",
      caption: "Address critical issues in the red zone",
      size: "sm"
    },  
  },
  {
    title: "Yellow – watchlist",
    subtitle: "Fine-tune and monitor",
    body:
      "Yellow means: works, but keep an eye on it. Improve data quality, stabilize mocks, and automate checks.",
    image: {
      src: "assets/images/rainbow/rainbowUni.png",
      alt: "Rainbow Testing color coding",
      caption: "Quality zones in the Rainbow model",
      position: "center",
      size: "lg"
    },
  },
  {
    title: "Green – solid foundation",
    subtitle: "Maintain, don't neglect",
    body:
      "Green signals reliably tested areas. Keep them that way: avoid regressions and refactor regularly.",
    image: {
      src: "assets/images/rainbow/rainbowUniD.png",
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
      src: "assets/images/rainbow/rainbow03.png",
      alt: "Rainbow Testing blue zone",
      caption: "Innovate safely in the blue zone",
    },
  },
];

const intro = createIntroSlide({
  id: "rainbow-intro",
  title: "Rainbow Testing",
  subtitle: "🌈 it's all about colors",
  body:
    "Welcome to the world of Rainbow Testing,\n" +
    "a colorful journey through testing methodologies.\n" +
    "In this presentation, we'll explore various testing strategies, tools,\n" +
    "and best practices to ensure your applications are robust and reliable.\n" +
    "\n" +
    "Let's dive in and add some color to your testing approach!",
  image: {
    src: "assets/images/rainbow/rainbowCldD.png",
    alt: "Rainbow Testing Intro Image",
    caption: "Embrace the colors of testing",
    position: "bottom-right",
    size: "lg"
  },
  reveal: { body: "word" },
});

const textSlides: TextSlide[] = textSlideOverrides.map((slideConfig, index) =>
  createTextSlide({
    ...slideConfig,
    id: slideConfig.id || `rainbow-text-${index + 1}`,
    reveal: { body: "word" },
  })
);

const outro = createOutroSlide({
  id: "rainbow-outro",
  title: "🌈  End 🌈",
  subtitle: "of show",
  body: "Thank you for joining this colorful journey through Rainbow Testing!",
  image: {
    src: "assets/images/rainbow/rainbowTestD.png",
    alt: "Rainbow Testing Outro Image",
    caption: "See you in the rainbow",
  },
  reveal: { body: "word" },
});

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
