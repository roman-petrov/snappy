import { Tap } from "@snappy/ui";

import type { useSettingsPanelButtonState } from "./SettingsPanelButton.state";

import styles from "./SettingsPanelButton.module.scss";

export type SettingsPanelButtonViewProps = ReturnType<typeof useSettingsPanelButtonState>;

export const SettingsPanelButtonView = ({ active, onPress, text, toggle, ...rest }: SettingsPanelButtonViewProps) => (
  <Tap
    ariaPressed={active}
    cn={toggle === true ? `${styles.button} ${styles.toggle}` : styles.button}
    onClick={onPress}
    onMouseDown={event => event.preventDefault()}
    {...rest}
  >
    {text}
  </Tap>
);
