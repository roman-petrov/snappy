import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import { $, type Color } from "../$";
import { Icons } from "../assets";
import styles from "./IconButton.module.scss";
import { Tap, type TapProps } from "./Tap";

export type IconButtonProps = Omit<TapProps, `children` | `cn` | `tip` | `vibrate`> & {
  color?: Color;
  filled?: boolean;
  icon: keyof typeof Icons | { emoji: string };
  tip: string;
};

export const IconButton = ({ color, filled = false, icon, tip, ...tapProps }: IconButtonProps) => (
  <Tap {...tapProps} cn={_.cn(styles.root, filled && styles.filled)} tip={tip} vibrate="confirm">
    {_.isString(icon) ? (
      <span aria-hidden className={color === undefined ? `` : $.color(color)} {...Html.text(Icons[icon])} />
    ) : (
      <span aria-hidden className={_.cn(color === undefined ? `` : $.color(color), styles.emoji)}>
        {icon.emoji}
      </span>
    )}
  </Tap>
);
