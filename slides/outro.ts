import { createOutroSlide } from "./templates.js";
import type { TextSlide } from "../types.js";

const outro: TextSlide = createOutroSlide({
  id: "outro",
  title: "🌈  End 🌈",
  subtitle: "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0of show",
  body: "Thank you for joining this colorful journey through Rainbow Testing!",
  image: {
    src: "assets/images/rainbowtest.png",
    alt: "Rainbow Testing Outro Image",
  },
});

export default outro;
