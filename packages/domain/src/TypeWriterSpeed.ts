export const TypeWriterSpeeds = [`fast`, `medium`, `slow`] as const;

export type TypeWriterSpeed = (typeof TypeWriterSpeeds)[number];
