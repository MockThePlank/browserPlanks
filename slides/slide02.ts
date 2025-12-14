import { createVideoSlide } from "./templates.js";
import type { VideoSlide } from "../types.js";

const slide02: VideoSlide = createVideoSlide({
  id: "slide02",
  title: "Video-Demo",
  video: {
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    autoplay: false,
    controls: true,
    muted: false,
    poster: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.jpg",
  },
});

export default slide02;
