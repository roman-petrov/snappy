import { _ } from "@snappy/core";
import { faviconUrl, Tap, type TapProps } from "@snappy/ui";

import styles from "./ProcessButton.module.scss";

export type ProcessButtonProps = Omit<TapProps, `children` | `cn`> & { loading?: boolean };

export const ProcessButton = ({ loading = false, ...tapProps }: ProcessButtonProps) => (
  <Tap {...tapProps} ariaBusy={loading} cn={_.cn(styles.btn, loading && styles.btnLoading)}>
    <img alt="" aria-hidden className={styles.icon} src={faviconUrl} />
  </Tap>
);
