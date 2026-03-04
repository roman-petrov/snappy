import colorStyles from "./css-modules/color.module.scss";
import typographyStyles from "./css-modules/typography.module.scss";

export type Color = keyof typeof colorStyles;

export type Typography = keyof typeof typographyStyles;

const color = (name: Color) => colorStyles[name];
const typography = (name: Typography) => typographyStyles[name];

export const $ = { color, typography };
