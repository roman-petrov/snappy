import { useGlassState } from "./Glass.state";
import { GlassView } from "./Glass.view";

export type GlassProps = { blur: number; cn?: string; flat?: boolean; roughness: number; tint: number };

export const Glass = (props: GlassProps) => <GlassView {...useGlassState(props)} />;
