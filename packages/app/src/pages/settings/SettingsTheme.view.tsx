import { FilledIcon, Icon, Page } from "@snappy/ui";
import { Settings } from "lucide-react";

import type { useSettingsThemeState } from "./SettingsTheme.state";

import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsThemeViewProps = ReturnType<typeof useSettingsThemeState>;

export const SettingsThemeView = (props: SettingsThemeViewProps) => (
  <Page back title={t(`settings.theme.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: <Icon icon="☀️" size="lg" />, label: t(`settings.theme.light`), value: `light` },
        { icon: <Icon icon="🌙" size="lg" />, label: t(`settings.theme.dark`), value: `dark` },
        { icon: <FilledIcon color="accentPlum" icon={Settings} />, label: t(`settings.theme.system`), value: `system` },
      ]}
    />
  </Page>
);
