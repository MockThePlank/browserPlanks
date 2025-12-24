import { createTableSlide } from "./templates.js";
const slide03 = createTableSlide({
    id: "slide03",
    title: "Deck basics",
    table: {
        columns: ["Feature", "Where", "Status"],
        rows: [
            ["Navigation (arrows, click, hash #/n)", "app.ts", "ready"],
            ["Slide templates (text/table/video/image)", "slides/templates.ts", "ready"],
            ["Deck routing via ?deck=<id>", "app.ts / presentations", "ready"],
            ["Themes per presentation", "styles/banner.css + theme class", "ready"],
            ["Add your own slides", "slides/ + presentations/index.ts", "ready"]
        ],
    },
});
export default slide03;
