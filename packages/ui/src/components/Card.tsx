import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { $, type Elevation, type Glass, type Radius, type Surface } from "../$";

export type CardProps = {
  children: ReactNode;
  cn?: string;
  elevation?: Elevation;
  glass?: Glass;
  radius?: Radius;
  surface?: Surface;
};

export const Card = ({
  children,
  cn,
  elevation = `e2`,
  glass = `none`,
  radius = `md`,
  surface = `surface`,
}: CardProps) => (
  <div
    className={_.cn(
      $.surface(glass === `simple` ? `surfaceGlass` : surface),
      glass !== `none` && $.glass(glass),
      $.elevation(elevation),
      $.radius(radius),
      cn,
    )}
  >
    {children}
  </div>
);
