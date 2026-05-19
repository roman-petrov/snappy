import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { $ } from "../$";

export type CardProps = { children: ReactNode; cn?: string };

export const Card = ({ children, cn }: CardProps) => (
  <div className={_.cn($.surface(`surface`), $.elevation(`e2`), $.radius(`md`), cn)}>{children}</div>
);
