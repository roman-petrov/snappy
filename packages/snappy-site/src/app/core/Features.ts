import type { FeatureType } from "@snappy/server-api";

export const featureEmoji: Record<FeatureType, string> = {
  addEmoji: `😀`,
  expand: `📝`,
  fixErrors: `✏️`,
  improveReadability: `📖`,
  shorten: `✂️`,
  styleBusiness: `💼`,
  styleFriendly: `🤝`,
  styleHumorous: `😄`,
  styleNeutral: `⚖️`,
  styleSelling: `🛒`,
};

export { defaultFeature, featureKeys } from "@snappy/server-api";

export type { FeatureType } from "@snappy/server-api";
