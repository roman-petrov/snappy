import { _ } from "@snappy/core";
import { Tap, type TapProps } from "@snappy/ui";

import styles from "./SmallButton.module.scss";

export type SmallButtonProps = Omit<TapProps, `children` | `cn`> & {
  compact?: boolean;
  full?: boolean;
  hideText?: boolean;
  icon: string;
  text: string;
  variant: `copy` | `danger` | `neutral`;
};

export const SmallButton = ({
  compact = false,
  full = false,
  hideText = false,
  icon,
  text,
  variant,
  ...tapProps
}: SmallButtonProps) => (
  <Tap
    {...tapProps}
    ariaLabel={text}
    cn={_.cn(
      styles.btn,
      ({ copy: styles.btnCopy, danger: styles.btnDanger, neutral: styles.btnNeutral } as const)[variant],
      compact && styles.btnCompact,
      full && styles.btnFull,
    )}
    title={text}
  >
    <span aria-hidden className={styles.icon}>
      {icon}
    </span>
    {hideText ? undefined : text}
  </Tap>
);
