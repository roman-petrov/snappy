import styles from "./Alert.module.scss";
import { Icon } from "./Icon";
import { Text } from "./Text";

export type AlertVariant = `error` | `info` | `success` | `warning`;

const variantIcon: Record<AlertVariant, Icon> = {
  error: `alert-error`,
  info: `alert-info`,
  success: `alert-success`,
  warning: `alert-warning`,
};

export type AlertProps = { text: string; variant: AlertVariant };

export const Alert = ({ text, variant }: AlertProps) => (
  <div className={`${styles.root} ${styles[variant]}`} role="alert">
    <Icon name={variantIcon[variant]} />
    <Text as="p" cn={styles.text} color={variant} text={text} typography="caption" />
  </div>
);
