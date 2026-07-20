import type { ReactNode } from "react";

import type { TapProps } from "./Tap";
import type { TextProps } from "./Text";

import { useChipState } from "./Chip.state";
import { ChipView } from "./Chip.view";

export type ChipColor = `accent` | `error` | `primary` | `soft` | `success` | `warning`;

export type ChipProps = Omit<TapProps, `children` | `cn` | `vibrate`> &
  Omit<TextProps, `as` | `children` | `cn` | `color` | `onClick` | `text` | `typography`> & {
    cn?: string;
    color: ChipColor;
    flat?: boolean;
    left?: ReactNode;
    text: string;
    tile?: boolean;
  };

export const Chip = (props: ChipProps) => <ChipView {...useChipState(props)} />;
