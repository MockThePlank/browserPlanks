import { createIntroSlide, createTableSlide, createTextSlide, createVideoSlide, createOutroSlide } from "./templates.js";
import type { Slide } from "../types.js";

// Default example deck showcasing all slide types.
export const slides: Slide[] = [
  createIntroSlide({
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
      src: "assets/images/rainbow01.png",
      alt: "Rainbow Testing Intro Image",
      caption: "Embrace the colors of testing",
    },
  }),
  createTextSlide({
    id: "slide01",
    title: "what?",
    subtitle: "about Culture and Philosophy of Testing",
    body:
      "Testing is not just a technical activity;\n" +
      "it's a mindset that influences how we approach software development and quality assurance.\n" +
      "Embracing a testing culture means valuing collaboration, continuous learning,\n " +
      "and a proactive approach to identifying and addressing potential issues early in the development process.\n " +
      "A strong testing philosophy encourages teams to view testing as an integral part of the development lifecycle,\n" +
      "promoting practices such as test-driven development (TDD) and continuous integration/continuous deployment (CI/CD).\n" +
      "By fostering a culture that prioritizes quality and encourages open communication about testing strategies\n" +
      "and outcomes, organizations can enhance their software's reliability, user satisfaction, and overall success.",
    transition: { type: "slide", duration: 500, easing: "ease-in-out" },
  }),
  createVideoSlide({
    id: "slide02",
    title: "Video-Demo",
    video: {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      autoplay: false,
      controls: true,
      muted: false,
      poster: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.jpg",
    },
  }),
  createTableSlide({
    id: "slide03",
    title: "Table Slide",
    table: {
      columns: ["Punkt", "Owner", "Status"],
      rows: [
        ["Slides laden & navigieren", "Frontend", "done"],
        ["Transitions smooth halten", "Design", "done"],
        ["Neue Templates dokumentieren", "Tech Writing", "pending"],
        ["Autoplay Video testen", "QA", "testing"],
      ],
    },
  }),
  createOutroSlide({
    title: "🌈  End 🌈",
    subtitle: "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0of show",
    body: "Thank you for joining this colorful journey through Rainbow Testing!",
    image: {
      src: "assets/images/rainbowtest.png",
      alt: "Rainbow Testing Outro Image",
    },
  }),
];
