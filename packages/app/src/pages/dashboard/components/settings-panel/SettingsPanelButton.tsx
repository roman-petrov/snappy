import type { TapProps } from "@snappy/ui";

import { useSettingsPanelButtonState } from "./SettingsPanelButton.state";
import { SettingsPanelButtonView } from "./SettingsPanelButton.view";

export type SettingsPanelButtonProps = Omit<TapProps, `ariaPressed` | `children` | `cn`> & {
  active?: boolean;
  text: string;
  toggle?: boolean;
};

export const SettingsPanelButton = (props: SettingsPanelButtonProps) => (
  <SettingsPanelButtonView {...useSettingsPanelButtonState(props)} />
);
