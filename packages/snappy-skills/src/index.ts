/**
 * ! For a strange reason import.meta.glob does not work
 * ! in production build with rolldown!
 */
import greetingText from "./skills/greeting-text.md?raw";
import iconGeneration from "./skills/icon-generation.md?raw";
import interiorGeneration from "./skills/interior-generation.md?raw";
import postcardGeneration from "./skills/postcard-generation.md?raw";
import textImprovement from "./skills/text-improvement.md?raw";
import visualDiagramGeneration from "./skills/visual-diagram-generation.md?raw";

export const Skills: Record<string, string> = {
  [`./skills/greeting-text.md`]: greetingText,
  [`./skills/icon-generation.md`]: iconGeneration,
  [`./skills/interior-generation.md`]: interiorGeneration,
  [`./skills/postcard-generation.md`]: postcardGeneration,
  [`./skills/text-improvement.md`]: textImprovement,
  [`./skills/visual-diagram-generation.md`]: visualDiagramGeneration,
};
