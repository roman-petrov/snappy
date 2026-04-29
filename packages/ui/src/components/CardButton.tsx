import { _ } from "@snappy/core";

import { $ } from "../$";
import { Tap, type TapProps } from "./Tap";

export type CardButtonProps = Omit<TapProps, `cn`> & { cn?: string };

export const CardButton = ({ cn, ...props }: CardButtonProps) => (
  <Tap {...props} cn={_.cn($.tap(`soft`), $.radius(`md`), cn)} />
);
