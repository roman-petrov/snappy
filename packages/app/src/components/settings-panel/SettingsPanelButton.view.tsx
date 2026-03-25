import { _ } from "@snappy/core";
import { Tap } from "@snappy/ui";

import type { useSettingsPanelButtonState } from "./SettingsPanelButton.state";

import styles from "./SettingsPanelButton.module.scss";

export type SettingsPanelButtonViewProps = ReturnType<typeof useSettingsPanelButtonState>;

export const SettingsPanelButtonView = ({ active, cn, onPress, text, ...rest }: SettingsPanelButtonViewProps) => (
  <Tap ariaPressed={active} cn={_.cn(styles.button, cn)} onClick={onPress} {...rest}>
    {text}
  </Tap>
);
