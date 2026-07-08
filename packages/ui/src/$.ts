import { Dom } from "@snappy/browser";

import bgStyles from "./css-modules/bg.module.scss";
import colorStyles from "./css-modules/color.module.scss";
import elevationStyles from "./css-modules/elevation.module.scss";
import iconSizeStyles from "./css-modules/icon-size.module.scss";
import radiusStyles from "./css-modules/radius.module.scss";
import surfaceStyles from "./css-modules/surface.module.scss";
import tapStyles from "./css-modules/tap.module.scss";
import typographyStyles from "./css-modules/typography.module.scss";
import { MetricsTracker } from "./metrics/MetricsTracker";

export type Bg = WithNone<typeof bgStyles>;

export type Color = WithNone<typeof colorStyles>;

export type Elevation = WithNone<typeof elevationStyles>;

export type IconSize = WithNone<typeof iconSizeStyles>;

export type Radius = WithNone<typeof radiusStyles>;

export type StyleNone = `none`;

export type Surface = WithNone<typeof surfaceStyles>;

export type TapKey = WithNone<typeof tapStyles>;

export type Typography = WithNone<typeof typographyStyles>;

type WithNone<T extends Record<string, string>> = keyof T | StyleNone;

const pick = <T extends Record<string, string>>(styles: T, name: keyof T | StyleNone | undefined) =>
  name === undefined || name === `none` ? `` : styles[name];

const bg = (name: Bg) => pick(bgStyles, name);
const color = (name?: Color) => pick(colorStyles, name);
const elevation = (name: Elevation) => pick(elevationStyles, name);
const iconSize = (name: IconSize) => pick(iconSizeStyles, name);
const radius = (name: Radius) => pick(radiusStyles, name);
const surface = (name: Surface) => pick(surfaceStyles, name);
const tap = (name: TapKey) => pick(tapStyles, name);
const typography = (name?: Typography) => (name === `body` ? `` : pick(typographyStyles, name));

const track = (name: string, parameters?: Parameters<typeof MetricsTracker.send>[1]) =>
  MetricsTracker.send(name, parameters);

export const $ = { bg, color, elevation, iconSize, radius, surface, tag: Dom.tag, tap, track, typography };
