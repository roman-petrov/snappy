import { _ } from "@snappy/core";
import { Tap, type TapProps } from "@snappy/ui";

import styles from "./ProcessButton.module.scss";

export type ProcessButtonProps = Omit<TapProps, `children` | `cn`> & {
  compact?: boolean;
  disabledEmpty?: boolean;
  loading?: boolean;
  text: string;
};

export const ProcessButton = ({
  compact = false,
  disabledEmpty = false,
  loading = false,
  text,
  ...tapProps
}: ProcessButtonProps) => (
  <Tap
    {...tapProps}
    ariaBusy={loading}
    ariaLabel={text}
    cn={_.cn(
      styles.btn,
      compact && styles.btnCompact,
      loading && styles.btnLoading,
      disabledEmpty && styles.btnDisabledEmpty,
    )}
  >
    <span aria-hidden className={styles.icon}>
      {loading ? `⋯` : `✨`}
    </span>
    {compact ? undefined : text}
  </Tap>
);
