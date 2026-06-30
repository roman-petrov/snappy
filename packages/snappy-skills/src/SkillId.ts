export const SkillId = [
  `greeting-text`,
  `help`,
  `icon-generation`,
  `image-editing`,
  `interior-generation`,
  `postcard-generation`,
  `text-improvement`,
  `visual-diagram-generation`,
] as const;

export type SkillId = (typeof SkillId)[number];
