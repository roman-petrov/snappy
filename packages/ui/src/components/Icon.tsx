/* eslint-disable react/no-danger */
import { type IconName, iconSvg } from "../assets";
import styles from "./Icon.module.css";

export type { IconName } from "../assets";

export type IconProps = { cn?: string; name: IconName };

export const Icon = ({ cn = ``, name }: IconProps) => (
  <span aria-hidden className={`${styles.root} ${cn}`.trim()} dangerouslySetInnerHTML={{ __html: iconSvg[name] }} />
);
