import { Html } from "@snappy/browser";

import colorStyles from "./css-modules/color.module.css";
import typographyStyles from "./css-modules/typography.module.css";

export type Color = keyof typeof colorStyles;

export type Typography = keyof typeof typographyStyles;

export const $ = {
  color: (name: Color) => colorStyles[name],
  html: Html.text,
  typography: (name: Typography) => typographyStyles[name],
};
