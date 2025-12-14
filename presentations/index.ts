import { defaultPresentation } from "./default.js";
import { rainbowPresentation } from "./rainbowTesting.js";
import type { Presentation } from "../types.js";

export const presentations: Record<string, Presentation> = {
  default: defaultPresentation,
  rainbow: rainbowPresentation,
};

export function getPresentation(id: string = "default"): Presentation {
  return presentations[id] || defaultPresentation;
}
