import type { ReactNode } from "react";

import { useTapState } from "./Tap.state";
import { TapView } from "./Tap.view";

export type TapLinkExternal = { href: string; rel?: string; target?: string };

export type TapProps = {
  ariaBusy?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  children: ReactNode;
  cn?: string;
  disabled?: boolean;
  link?: string | TapLinkExternal;
  onClick?: () => void;
  submit?: boolean;
  title?: string;
};

export const Tap = (props: TapProps) => <TapView {...useTapState(props)} />;
