import { defaultPresentation } from "./default.js";
import { rainbowPresentation } from "./rainbowTesting.js";

export const presentations = {
  default: defaultPresentation,
  rainbow: rainbowPresentation,
};

export function getPresentation(id = "default") {
  return presentations[id] || defaultPresentation;
}
