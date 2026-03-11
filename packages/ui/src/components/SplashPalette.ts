/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { CSSProperties } from "react";

import type { SparkleColor } from "../web-gl";

export type SplashPalette = {
  color: SparkleColor;
  textColor: CSSProperties[`color`];
  textShadow: CSSProperties[`textShadow`];
};

const textColor = `#fff`;
const textShadow = `0 1px 2px oklch(0% 0 0deg / 40%)`;

export const SplashPalette = {
  default: { color: [0.45, 0.76, 0.68] as SparkleColor, textColor, textShadow },
  link: { color: [0.6, 0.55, 0.8] as SparkleColor, textColor, textShadow },
  primary: { color: [0.4, 0.7, 0.74] as SparkleColor, textColor, textShadow },
};
