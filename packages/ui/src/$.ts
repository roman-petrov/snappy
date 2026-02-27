import colorStyles from "./css-modules/color.module.scss";
import typographyStyles from "./css-modules/typography.module.scss";

export type Color = keyof typeof colorStyles;

export type Typography = keyof typeof typographyStyles;

export const $ = {
  color: (name: Color) => colorStyles[name],
  typography: (name: Typography) => typographyStyles[name],
};
