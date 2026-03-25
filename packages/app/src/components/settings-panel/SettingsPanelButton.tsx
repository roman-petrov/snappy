import type { TapProps } from "@snappy/ui";

import { useSettingsPanelButtonState } from "./SettingsPanelButton.state";
import { SettingsPanelButtonView } from "./SettingsPanelButton.view";

export type SettingsPanelButtonProps = Omit<TapProps, `ariaPressed` | `children` | `cn`> & {
  active?: boolean;
  cn?: string;
  text: string;
};

export const SettingsPanelButton = (props: SettingsPanelButtonProps) => (
  <SettingsPanelButtonView {...useSettingsPanelButtonState(props)} />
);
