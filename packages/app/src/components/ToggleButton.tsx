import { _ } from "@snappy/core";
import { Tap, type TapProps } from "@snappy/ui";

import styles from "./ToggleButton.module.scss";

export type ToggleButtonProps = Omit<TapProps, `children` | `cn`> & {
  compact?: boolean;
  pressed: boolean;
  text: string;
  variant: `emoji` | `format`;
};

export const ToggleButton = ({ compact = false, pressed, text, variant, ...tapProps }: ToggleButtonProps) => (
  <Tap
    {...tapProps}
    ariaLabel={text}
    ariaPressed={pressed}
    cn={_.cn(
      styles.btn,
      compact && styles.btnCompact,
      pressed && (variant === `emoji` ? styles.btnEmoji : styles.btnFormat),
    )}
    title={text}
  >
    {text}
  </Tap>
);
