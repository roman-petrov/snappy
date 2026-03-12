import type { RefObject } from "react";

import styles from "./Splash.module.scss";

export type SplashViewProps = { canvasRef: RefObject<HTMLCanvasElement | null> };

export const SplashView = ({ canvasRef }: SplashViewProps) => (
  <canvas aria-hidden className={styles.canvas} ref={canvasRef} />
);
