import type { useSettingsLanguageState } from "./SettingsLanguage.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsLanguageViewProps = ReturnType<typeof useSettingsLanguageState>;

export const SettingsLanguageView = (props: SettingsLanguageViewProps) => (
  <Page back title={t(`settings.language`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: `🇷🇺`, label: t(`settingsLanguage.ru`), value: `ru` },
        { icon: `🇬🇧`, label: t(`settingsLanguage.en`), value: `en` },
        { icon: `⚙️`, label: t(`settingsLanguage.system`), value: `system` },
      ]}
    />
  </Page>
);
