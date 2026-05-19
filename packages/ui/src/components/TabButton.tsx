import { _ } from "@snappy/core";

import { $ } from "../$";
import styles from "./TabButton.module.scss";
import { Tap, type TapProps } from "./Tap";

export type TabButtonProps = Omit<TapProps, `children` | `cn`> & { active?: boolean; text: string };

export const TabButton = ({ active = false, onClick, text, ...rest }: TabButtonProps) => (
  <Tap
    {...rest}
    children={text}
    cn={_.cn($.radius(`sm`), $.typography(`caption`), styles.tab, active ? $.tap(`accent`) : $.tap(`soft`))}
    onClick={onClick}
    vibrate="segmentTick"
  />
);
