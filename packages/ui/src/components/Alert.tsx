import { Check, CircleX, Info, TriangleAlert } from "lucide-react";

import styles from "./Alert.module.scss";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { Text } from "./Text";

const icons = { error: CircleX, info: Info, success: Check, warning: TriangleAlert } as const;

export type AlertProps = { text: string; type: AlertType };

export type AlertType = `error` | `info` | `success` | `warning`;

export const Alert = ({ text, type }: AlertProps) => (
  <Card cn={styles.root} radius="sm" surface={type}>
    <Icon icon={icons[type]} />
    <Text as="p" cn={styles.text} text={text} typography="caption" />
  </Card>
);
