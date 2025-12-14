import { createTableSlide } from "./templates.js";
import type { TableSlide } from "../types.js";

const slide03: TableSlide = createTableSlide({
  id: "slide03",
  title: "Deck basics",
  table: {
    columns: ["Feature", "Where", "Status"],
    rows: [
      ["Navigation (arrows, click, hash #/n)", "app.ts", "ready"],
      ["Slide templates (text/table/video/image)", "slides/templates.ts", "ready"],
      ["Deck routing via ?deck=<id>", "app.ts / presentations", "ready"],
      ["Themes per presentation", "styles/banner.css + theme class", "ready"],
      ["Data-testid hooks", "app.ts renderers", "ready"],
    ],
  },
});

export default slide03;
