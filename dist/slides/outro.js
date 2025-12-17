import { createOutroSlide } from "./templates.js";
const outro = createOutroSlide({
    id: "outro",
    title: "Build your own deck",
    subtitle: "Pick slides, edit content, ship",
    body: "Copy these slide templates, swap in your content, and set a theme.\n" +
        "Register your deck in presentations/index.ts and load it via ?deck=<id>.\n" +
        "Happy presenting!",
    image: {
        src: "assets/images/default/default03.png",
        alt: "Presentation complete illustration",
        position: "center",
    },
});
export default outro;
