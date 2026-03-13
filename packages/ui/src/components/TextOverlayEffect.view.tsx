import type { useTextOverlayEffectState } from "./TextOverlayEffect.state";

import styles from "./TextOverlayEffect.module.scss";

export type TextOverlayEffectViewProps = ReturnType<typeof useTextOverlayEffectState>;

export const TextOverlayEffectView = ({ containerRef }: TextOverlayEffectViewProps) => (
  <div className={styles.container} ref={containerRef} />
);
