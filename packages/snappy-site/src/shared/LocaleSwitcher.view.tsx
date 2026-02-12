import type { useLocaleSwitcherState } from "./LocaleSwitcher.state";

import styles from "./LocaleSwitcher.module.css";

export type LocaleSwitcherViewProps = ReturnType<typeof useLocaleSwitcherState>;

export const LocaleSwitcherView = ({ ariaLabel, label, onClick }: LocaleSwitcherViewProps) => (
  <button
    aria-label={ariaLabel}
    className={styles[`toggle`]}
    onClick={onClick}
    title={ariaLabel}
    type="button"
  >
    {label}
  </button>
);
