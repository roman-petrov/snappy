import type { useSettingsThemeState } from "./SettingsTheme.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsThemeViewProps = ReturnType<typeof useSettingsThemeState>;

export const SettingsThemeView = ({ onSelect, value }: SettingsThemeViewProps) => (
  <Page back title={t(`settings.appearance`)}>
    <SettingsOptionList
      onSelect={onSelect}
      options={[
        { icon: `☀️`, label: t(`settingsTheme.light`), value: `light` },
        { icon: `🌙`, label: t(`settingsTheme.dark`), value: `dark` },
        { icon: `📱`, label: t(`settingsTheme.system`), value: `system` },
      ]}
      selectedValue={value}
    />
  </Page>
);
