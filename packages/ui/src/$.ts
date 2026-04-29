import colorStyles from "./css-modules/color.module.scss";
import elevationStyles from "./css-modules/elevation.module.scss";
import iconSizeStyles from "./css-modules/icon-size.module.scss";
import radiusStyles from "./css-modules/radius.module.scss";
import surfaceStyles from "./css-modules/surface.module.scss";
import tapStyles from "./css-modules/tap.module.scss";
import typographyStyles from "./css-modules/typography.module.scss";

export type Color = keyof typeof colorStyles;

export type Elevation = keyof typeof elevationStyles;

export type IconSize = keyof typeof iconSizeStyles;

export type Radius = keyof typeof radiusStyles;

export type Surface = keyof typeof surfaceStyles;

export type TapKey = keyof typeof tapStyles;

export type Typography = keyof typeof typographyStyles;

const color = (name: Color) => colorStyles[name];
const elevation = (name: Elevation) => elevationStyles[name];
const iconSize = (name: IconSize) => iconSizeStyles[name];
const radius = (name: Radius) => radiusStyles[name];
const surface = (name: Surface) => surfaceStyles[name];
const tap = (name: TapKey) => tapStyles[name];
const typography = (name: Typography) => typographyStyles[name];

export const $ = { color, elevation, iconSize, radius, surface, tap, typography };
