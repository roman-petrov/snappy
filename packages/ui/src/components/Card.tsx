import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { $ } from "../$";

export type CardProps = { active?: boolean; children: ReactNode; cn?: string };

export const Card = ({ active = false, children, cn }: CardProps) => (
  <div className={_.cn($.surface(`surface`), active ? $.elevation(`e4`) : $.elevation(`e2`), $.radius(`md`), cn)}>
    {children}
  </div>
);
