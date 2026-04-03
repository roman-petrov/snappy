import type { useTabButtonState } from "./TabButton.state";

import styles from "./TabButton.module.scss";
import { Tap } from "./Tap";

export type TabButtonViewProps = ReturnType<typeof useTabButtonState>;

export const TabButtonView = ({ active, onPress, text, toggle, ...rest }: TabButtonViewProps) => (
  <Tap
    ariaPressed={active}
    cn={toggle === true ? `${styles.tab} ${styles.toggle}` : styles.tab}
    keepFocus
    onClick={onPress}
    {...rest}
  >
    {text}
  </Tap>
);
