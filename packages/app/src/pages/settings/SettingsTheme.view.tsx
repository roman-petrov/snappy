import type { useSettingsThemeState } from "./SettingsTheme.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsThemeViewProps = ReturnType<typeof useSettingsThemeState>;

export const SettingsThemeView = (props: SettingsThemeViewProps) => (
  <Page back title={t(`settings.theme.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: `light_mode`, label: t(`settings.theme.light`), value: `light` },
        { icon: `dark_mode`, label: t(`settings.theme.dark`), value: `dark` },
        { icon: `brightness_auto`, label: t(`settings.theme.system`), value: `system` },
      ]}
    />
  </Page>
);
