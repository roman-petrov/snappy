export const SnappyToolId = [
  `ask`,
  `date-time`,
  `edit-image`,
  `look-image`,
  `publish-image`,
  `publish-text`,
  `skill`,
  `transcribe-audio`,
] as const;

export type SnappyToolId = (typeof SnappyToolId)[number];
