import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { $, type Elevation, type Radius, type Surface } from "../$";

export type CardProps = { children: ReactNode; cn?: string; elevation?: Elevation; radius?: Radius; surface?: Surface };

export const Card = ({ children, cn, elevation = `e2`, radius = `md`, surface = `surface` }: CardProps) => (
  <div className={_.cn($.surface(surface), $.elevation(elevation), $.radius(radius), cn)}>{children}</div>
);
