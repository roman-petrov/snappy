import { useTextOverlayEffectState } from "./TextOverlayEffect.state";
import { TextOverlayEffectView } from "./TextOverlayEffect.view";

export type TextOverlayEffectProps = { accentColor?: number; speed?: number };

export const TextOverlayEffect = (props: TextOverlayEffectProps) => (
  <TextOverlayEffectView {...useTextOverlayEffectState(props)} />
);
