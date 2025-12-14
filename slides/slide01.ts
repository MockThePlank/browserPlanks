import type { TextSlide } from "../types.js";

const slide01: TextSlide = {
  id: "slide01",
  type: "text",
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
};

export default slide01;
