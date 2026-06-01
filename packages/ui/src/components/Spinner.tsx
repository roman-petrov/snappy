import { _ } from "@snappy/core";

import { $, type Color } from "../$";
import styles from "./Spinner.module.scss";

export type SpinnerProps = { cn?: string; color?: Color };

export const Spinner = ({ cn, color = `primary` }: SpinnerProps) => (
  <span className={_.cn(styles.root, $.color(color), cn)} />
);
