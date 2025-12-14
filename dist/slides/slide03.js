import { createTableSlide } from "./templates.js";
const slide03 = createTableSlide({
    id: "slide03",
    title: "Table Slide",
    table: {
        columns: ["Punkt", "Owner", "Status"],
        rows: [
            ["Slides laden & navigieren", "Frontend", "done"],
            ["Transitions smooth halten", "Design", "done"],
            ["Neue Templates dokumentieren", "Tech Writing", "pending"],
            ["Autoplay Video testen", "QA", "testing"],
        ],
    },
});
export default slide03;
