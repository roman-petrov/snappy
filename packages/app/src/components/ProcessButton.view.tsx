import type { useProcessButtonState } from "./ProcessButton.state";

import styles from "./ProcessButton.module.scss";

export type ProcessButtonViewProps = ReturnType<typeof useProcessButtonState>;

export const ProcessButtonView = ({
  ariaBusy,
  ariaLabel,
  btnClassKeys,
  disabled,
  icon,
  label,
}: ProcessButtonViewProps) => (
  <button
    aria-busy={ariaBusy}
    aria-label={ariaLabel}
    className={[styles.btn, ...btnClassKeys.map(key => styles[key])].join(` `)}
    disabled={disabled}
    type="submit"
  >
    <span aria-hidden className={styles.icon}>
      {icon}
    </span>
    {label}
  </button>
);
