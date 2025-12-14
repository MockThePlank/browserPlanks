import type { VideoSlide } from "../types.js";

const slide02: VideoSlide = {
  id: "slide02",
  type: "video",
  title: "Video-Demo",
  video: {
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    autoplay: false,
    controls: true,
    muted: false,
    poster: "https://interactive-examples.mdn.mozilla.net/media/examples/flower.jpg",
  },
  transition: { type: "zoom", duration: 600, easing: "ease-out" },
};

export default slide02;
