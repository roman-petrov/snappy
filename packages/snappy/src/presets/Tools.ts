import type { SnappyToolId } from "./Types";

export const SnappyPresetTools = {
  audio: [`ask`, `date-time`, `publish-text`, `transcribe-audio`] as const satisfies readonly SnappyToolId[],
  edit: [`ask`, `date-time`, `edit-image`, `look-image`, `publish-image`] as const satisfies readonly SnappyToolId[],
  help: [`ask`, `date-time`, `publish-text`, `skill`] as const satisfies readonly SnappyToolId[],
  plan: [`ask`, `date-time`, `publish-text`] as const satisfies readonly SnappyToolId[],
  text: [`ask`, `date-time`, `publish-text`] as const satisfies readonly SnappyToolId[],
  vision: [`ask`, `date-time`, `look-image`, `publish-text`] as const satisfies readonly SnappyToolId[],
  visual: [`ask`, `date-time`, `look-image`, `publish-image`] as const satisfies readonly SnappyToolId[],
} as const;
