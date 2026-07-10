import type { GlassLook } from "./GlassLook";

import { useGlassState } from "./Glass.state";
import { GlassView } from "./Glass.view";

export type GlassProps = { cn?: string; flat?: boolean; look: GlassLook };

export const Glass = (props: GlassProps) => <GlassView {...useGlassState(props)} />;
