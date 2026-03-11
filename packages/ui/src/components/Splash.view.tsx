import type { useSplashState } from "./Splash.state";

import styles from "./Splash.module.scss";

export type SplashViewProps = ReturnType<typeof useSplashState>;

export const SplashView = ({
  backgroundClassName,
  canvasLayerClassName,
  canvasRef,
  children,
  containerRef,
  contentStyle,
  onPointerDown,
  setWrapperRef,
}: SplashViewProps) => (
  <span className={styles.wrapper} data-splash onPointerDown={onPointerDown} ref={setWrapperRef}>
    {backgroundClassName === undefined ? undefined : <div aria-hidden className={backgroundClassName} />}
    <div
      aria-hidden
      className={[styles.canvasLayer, canvasLayerClassName].filter(Boolean).join(` `)}
      ref={containerRef}
    >
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
    <span className={styles.content} style={contentStyle}>
      {children}
    </span>
  </span>
);
