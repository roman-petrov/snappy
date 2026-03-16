import { _ } from "@snappy/core";

import styles from "./Button.module.scss";
import { Icon, type Icon as IconName } from "./Icon";
import { Tap, type TapProps } from "./Tap";

export type ButtonProps = Omit<TapProps, `children` | `cn`> & {
  cn?: string;
  icon?: IconName;
  large?: boolean;
  text: string;
  type?: `default` | `primary`;
};

export const Button = ({ cn = ``, icon, large = false, text, type = `default`, ...tapProps }: ButtonProps) => (
  <Tap {...tapProps} cn={_.cn(styles.root, styles[type], large && styles.large, cn)}>
    {icon === undefined ? undefined : <Icon name={icon} />}
    {text}
  </Tap>
);
