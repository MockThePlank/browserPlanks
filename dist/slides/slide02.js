import { createVideoSlide } from "./templates.js";
const slide02 = createVideoSlide({
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
