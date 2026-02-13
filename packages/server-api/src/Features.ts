/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { type FeatureType, Prompts } from "@snappy/snappy";

export type { FeatureType } from "@snappy/snappy";

export const featureKeys: FeatureType[] = Object.keys(Prompts.systemPrompts) as FeatureType[];

export const defaultFeature: FeatureType = featureKeys[0] ?? `addEmoji`;
