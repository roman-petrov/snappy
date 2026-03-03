import type { useLocaleSwitcherState } from "./LocaleSwitcher.state";

import styles from "./LocaleSwitcher.module.scss";
import { Text } from "./Text";

export type LocaleSwitcherViewProps = ReturnType<typeof useLocaleSwitcherState>;

export const LocaleSwitcherView = ({ ariaLabel, label, onClick }: LocaleSwitcherViewProps) => (
  <button aria-label={ariaLabel} className={styles.toggle} onClick={onClick} title={ariaLabel} type="button">
    <Text as="span" text={label} typography="caption" />
  </button>
);
