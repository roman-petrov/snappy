import { _ } from "@snappy/core";

import { $, type Color } from "../../$";
import { Icon } from "../Icon";
import { Tap, type TapProps } from "../Tap";
import styles from "./MenuButton.module.scss";

export type MenuButtonProps = Omit<TapProps, `children` | `cn` | `tip` | `vibrate`> & {
  color?: Color;
  icon: Exclude<Icon, { emoji: string }>;
  tip: string;
};

export const MenuButton = ({ color, icon, tip, ...tapProps }: MenuButtonProps) => (
  <Tap {...tapProps} cn={_.cn($.tap(`soft`), $.radius(`lg`), styles.root)} tip={tip} vibrate="confirm">
    <Icon color={color} name={icon} />
    <span className={$.typography(`bodySm`)}>{tip}</span>
  </Tap>
);
