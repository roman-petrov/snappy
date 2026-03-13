import type { useSmallButtonState } from "./SmallButton.state";

import styles from "./SmallButton.module.scss";

export type SmallButtonViewProps = ReturnType<typeof useSmallButtonState>;

export const SmallButtonView = ({
  buttonClassKeys,
  buttonLabel,
  disabled,
  icon,
  onClick,
  title,
}: SmallButtonViewProps) => (
  <button
    aria-label={title}
    className={[styles.btn, ...buttonClassKeys.map(key => styles[key])].join(` `)}
    disabled={disabled}
    onClick={onClick}
    title={title}
    type="button"
  >
    <span aria-hidden className={styles.icon}>
      {icon}
    </span>
    {buttonLabel}
  </button>
);
