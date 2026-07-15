import { _ } from "@snappy/core";

import { $ } from "../$";
import { Tap, type TapProps } from "./Tap";

export type CardButtonProps = Omit<TapProps, `cn`> & { cn?: string; plain?: boolean };

export const CardButton = ({ cn, plain = false, ...props }: CardButtonProps) => (
  <Tap {...props} cn={_.cn(plain ? undefined : $.tap(`soft`), $.radius(`md`), cn)} />
);
