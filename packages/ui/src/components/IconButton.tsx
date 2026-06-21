import { _ } from "@snappy/core";

import { $, type Color } from "../$";
import { Icon } from "./Icon";
import styles from "./IconButton.module.scss";
import { Tap, type TapProps } from "./Tap";

export type IconButtonProps = Omit<TapProps, `children` | `cn`> & { color?: Color; icon: Icon; tip: string };

export const IconButton = ({ color, icon, tip, vibrate = `confirm`, ...tapProps }: IconButtonProps) => (
  <Tap {...tapProps} cn={_.cn($.tap(`icon`), styles.root)} tip={tip} vibrate={vibrate}>
    <Icon color={color} icon={icon} />
  </Tap>
);
