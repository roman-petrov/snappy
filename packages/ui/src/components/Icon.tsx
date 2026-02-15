/* eslint-disable react/no-danger */
import { IconSvg } from "../assets";
import styles from "./Icon.module.css";

export type Icon = keyof typeof IconSvg;

export type IconProps = { cn?: string; name: Icon };

export const Icon = ({ cn = ``, name }: IconProps) => (
  <span aria-hidden className={`${styles.root} ${cn}`.trim()} dangerouslySetInnerHTML={{ __html: IconSvg[name] }} />
);
