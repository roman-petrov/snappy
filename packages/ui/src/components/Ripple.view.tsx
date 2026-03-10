import type { useRippleState } from "./Ripple.state";

import styles from "./Ripple.module.scss";

export type RippleViewProps = ReturnType<typeof useRippleState>;

export const RippleView = ({
  children,
  disabled,
  onPointerDown,
  remove,
  ripples,
  wrapperRefCallback,
}: RippleViewProps) => (
  <span className={styles.wrapper} onPointerDown={disabled ? undefined : onPointerDown} ref={wrapperRefCallback}>
    {children}
    <div aria-hidden className={styles.container}>
      {ripples.map(r => (
        <span className={styles.ripple} key={r.id} onAnimationEnd={() => remove(r.id)} style={r.style} />
      ))}
    </div>
  </span>
);
