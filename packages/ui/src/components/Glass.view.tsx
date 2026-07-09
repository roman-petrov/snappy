import { _ } from "@snappy/core";

import type { useGlassState } from "./Glass.state";

import styles from "./Glass.module.scss";

export type GlassViewProps = ReturnType<typeof useGlassState>;

export const GlassView = ({ blur, cn, grain, id, relief, tint }: GlassViewProps) => (
  <div
    className={_.cn(styles.glass, cn)}
    style={{
      [`--glass-blur` as string]: _.px(blur),
      [`--glass-grain` as string]: grain,
      [`--glass-tint` as string]: tint,
    }}
  >
    <div className={styles.grain} style={{ filter: `url(#${id})` }} />
    <svg aria-hidden="true" className={styles.defs}>
      <filter height="100%" id={id} width="100%" x="0" y="0">
        <feTurbulence baseFrequency="1.1" numOctaves="2" result="noise" seed="7" type="fractalNoise" />
        <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale={relief}>
          <feDistantLight azimuth="235" elevation="45" />
        </feDiffuseLighting>
      </filter>
    </svg>
  </div>
);
