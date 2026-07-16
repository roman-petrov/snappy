import { _ } from "@snappy/core";

import { $, type Color, type IconSize } from "../$";
import styles from "./Spinner.module.scss";

export type SpinnerProps = { cn?: string; color?: Color; size?: IconSize; time?: string };

export const Spinner = ({ cn, color = `primary`, size = `sm`, time }: SpinnerProps) => (
  <span className={_.cn(styles.wrap, $.iconSize(size), $.color(color), cn)}>
    <span className={styles.root} />
    {time === undefined ? undefined : <span className={styles.time}>{time}</span>}
  </span>
);
