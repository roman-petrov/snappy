import { _ } from "@snappy/core";

import { $ } from "../$";
import styles from "./Alert.module.scss";
import { Icon } from "./Icon";
import { Text } from "./Text";

export type AlertProps = { text: string; type: AlertType };

export type AlertType = `error` | `info` | `success` | `warning`;

export const Alert = ({ text, type }: AlertProps) => (
  <div className={_.cn(styles.root, $.surface(type), $.elevation(`e2`), $.radius(`sm`))}>
    <Icon name={({ error: `cancel`, info: `info`, success: `check`, warning: `warning` } as const)[type]} />
    <Text as="p" cn={styles.text} color={type} text={text} typography="caption" />
  </div>
);
