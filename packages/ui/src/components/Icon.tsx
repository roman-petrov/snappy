/* eslint-disable react/no-danger */
import { Icons } from "../assets";
import styles from "./Icon.module.css";

export type Icon = keyof typeof Icons;

export type IconProps = { cn?: string; name: Icon };

export const Icon = ({ cn = ``, name }: IconProps) => (
  <span aria-hidden className={`${styles.root} ${cn}`.trim()} dangerouslySetInnerHTML={{ __html: Icons[name] }} />
);
