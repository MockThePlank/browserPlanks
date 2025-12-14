import { defaultPresentation } from "./default.js";
import { rainbowPresentation } from "./rainbowTesting.js";
import { terminalAIPresentation } from "./terminalAI.js";
export const presentations = {
    default: defaultPresentation,
    rainbow: rainbowPresentation,
    terminalAI: terminalAIPresentation,
};
export function getPresentation(id = "default") {
    return presentations[id] || defaultPresentation;
}
