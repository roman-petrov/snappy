import { Page } from "@snappy/ui";
import { Moon, Sun, SunMoon } from "lucide-react";

import type { useSettingsThemeState } from "./SettingsTheme.state";

import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsThemeViewProps = ReturnType<typeof useSettingsThemeState>;

export const SettingsThemeView = (props: SettingsThemeViewProps) => (
  <Page back title={t(`settings.theme.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: Sun, label: t(`settings.theme.light`), value: `light` },
        { icon: Moon, label: t(`settings.theme.dark`), value: `dark` },
        { icon: SunMoon, label: t(`settings.theme.system`), value: `system` },
      ]}
    />
  </Page>
);
