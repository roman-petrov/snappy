import type { ReactNode } from "react";

import type { Surface, TapKey } from "../$";
import type { TapProps } from "./Tap";
import type { TextProps } from "./Text";

import { useChipState } from "./Chip.state";
import { ChipView } from "./Chip.view";

export type ChipColor = Surface | TapKey;

export type ChipProps = Omit<TapProps, `children` | `cn` | `vibrate`> &
  Omit<TextProps, `as` | `children` | `cn` | `color` | `onClick` | `text` | `typography`> & {
    cn?: string;
    color: ChipColor;
    left?: ReactNode;
    text: string;
  };

export const Chip = (props: ChipProps) => <ChipView {...useChipState(props)} />;
