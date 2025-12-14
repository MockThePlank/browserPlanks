import { createIntroSlide } from "./templates.js";
const intro = createIntroSlide({
    title: "Browser Planks",
    subtitle: "Tiny vanilla JS slide deck",
    body: "Welcome! Browser Planks is a lightweight, framework-free slide app.\n" +
        "Use it as a starter: copy slide templates, plug in your content, and ship a deck in minutes.\n" +
        "You'll see how to run, navigate, and theme your presentation in the following slides.",
    image: {
        src: "assets/images/default/default02.png",
        alt: "Default deck abstract gradient",
    },
});
export default intro;
