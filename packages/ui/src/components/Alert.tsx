import { Check, CircleX, Info, TriangleAlert } from "lucide-react";

import styles from "./Alert.module.scss";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { Text } from "./Text";

export type AlertProps = { text: string; type: AlertType };

export type AlertType = `error` | `info` | `success` | `warning`;

export const Alert = ({ text, type }: AlertProps) => (
  <Card cn={styles.root} elevation="e1" radius="sm" surface={type}>
    <Icon icon={{ error: CircleX, info: Info, success: Check, warning: TriangleAlert }[type]} />
    <Text as="p" cn={styles.text} text={text} typography="caption" />
  </Card>
);

export type ErrorAlertProps = Omit<AlertProps, `type`>;

export type InfoAlertProps = Omit<AlertProps, `type`>;

export type SuccessAlertProps = Omit<AlertProps, `type`>;

export type WarningAlertProps = Omit<AlertProps, `type`>;

export const ErrorAlert = ({ text }: ErrorAlertProps) => <Alert text={text} type="error" />;

export const InfoAlert = ({ text }: InfoAlertProps) => <Alert text={text} type="info" />;

export const SuccessAlert = ({ text }: SuccessAlertProps) => <Alert text={text} type="success" />;

export const WarningAlert = ({ text }: WarningAlertProps) => <Alert text={text} type="warning" />;
