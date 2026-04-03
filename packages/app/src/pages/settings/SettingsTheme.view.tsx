import type { useSettingsThemeState } from "./SettingsTheme.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsThemeViewProps = ReturnType<typeof useSettingsThemeState>;

export const SettingsThemeView = (props: SettingsThemeViewProps) => (
  <Page back title={t(`settings.theme`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: `☀️`, label: t(`settingsTheme.light`), value: `light` },
        { icon: `🌙`, label: t(`settingsTheme.dark`), value: `dark` },
        { icon: `📱`, label: t(`settingsTheme.system`), value: `system` },
      ]}
    />
  </Page>
);
