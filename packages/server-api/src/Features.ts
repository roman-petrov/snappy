const featureKeys = [
  `addEmoji`,
  `expand`,
  `fixErrors`,
  `improveReadability`,
  `shorten`,
  `styleBusiness`,
  `styleFriendly`,
  `styleHumorous`,
  `styleNeutral`,
  `styleSelling`,
] as const;

export type FeatureType = (typeof featureKeys)[number];

export { featureKeys };

export const defaultFeature: FeatureType = featureKeys[0];
