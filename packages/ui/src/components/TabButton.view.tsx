import { _ } from "@snappy/core";

import type { useTabButtonState } from "./TabButton.state";

import { $ } from "../$";
import styles from "./TabButton.module.scss";
import { Tap } from "./Tap";

export type TabButtonViewProps = ReturnType<typeof useTabButtonState>;

export const TabButtonView = ({ active, onPress, text, toggle: _toggle, ...rest }: TabButtonViewProps) => (
  <Tap
    cn={_.cn($.radius(`sm`), $.typography(`caption`), styles.tab, active ? $.tap(`accent`) : $.tap(`soft`))}
    keepFocus
    onClick={onPress}
    pressed={active}
    {...rest}
  >
    {text}
  </Tap>
);
