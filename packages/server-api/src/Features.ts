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

const [defaultFeature] = featureKeys;

export { defaultFeature };
