import type { ReactNode } from "react";

import { useRippleState } from "./Ripple.state";
import { RippleView } from "./Ripple.view";

export type RippleProps = { children: ReactNode; disabled?: boolean; speedFactor?: number };

export const Ripple = (props: RippleProps) => <RippleView {...useRippleState(props)} />;
