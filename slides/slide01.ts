import { createTextSlide } from "./templates.js";
import type { TextSlide } from "../types.js";

const slide01: TextSlide = createTextSlide({
  id: "slide01",
  title: "Run it locally",
  subtitle: "Two quick options",
  body:
    "1) Open index.html directly in your browser.\n" +
    "2) Or run a local server: `python3 -m http.server 3000` and open http://localhost:3000.\n" +
    "Switch decks via query param: `?deck=default`, `?deck=rainbow`, `?deck=terminalAI`.",
  image: {
    src: "assets/images/default/default01.png",
    alt: "Default deck startup illustration",
  },
  transition: { type: "slide", duration: 500, easing: "ease-in-out" },
});

export default slide01;
