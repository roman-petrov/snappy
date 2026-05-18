import type { Vibrate } from "@snappy/platform";
import type { ReactNode } from "react";

import { useTapState } from "./Tap.state";
import { TapView } from "./Tap.view";

export type TapLinkExternal = { href: string; rel?: string; target?: string };

export type TapProps = {
  children: ReactNode;
  cn?: string;
  disabled?: boolean;
  keepFocus?: boolean;
  link?: string | TapLinkExternal;
  onClick?: () => void;
  submit?: boolean;
  tip?: string;
  vibrate?: Vibrate;
};

export const Tap = (props: TapProps) => <TapView {...useTapState(props)} />;
