import { _ } from "@snappy/core";
import { Check, CircleX, Info, TriangleAlert } from "lucide-react";

import { $ } from "../$";
import styles from "./Alert.module.scss";
import { Icon } from "./Icon";
import { Text } from "./Text";

const icons = { error: CircleX, info: Info, success: Check, warning: TriangleAlert } as const;

export type AlertProps = { text: string; type: AlertType };

export type AlertType = `error` | `info` | `success` | `warning`;

export const Alert = ({ text, type }: AlertProps) => (
  <div className={_.cn(styles.root, $.surface(type), $.elevation(`e2`), $.radius(`sm`))}>
    <Icon icon={icons[type]} />
    <Text as="p" cn={styles.text} text={text} typography="caption" />
  </div>
);
