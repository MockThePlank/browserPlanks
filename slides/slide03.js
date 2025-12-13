export default {
  id: "slide03",
  type: "table",
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
  transition: { type: "slide", duration: 450, easing: "cubic-bezier(.25,.8,.25,1)" },
};
