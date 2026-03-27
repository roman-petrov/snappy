import type { useSettingsLanguageState } from "./SettingsLanguage.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsLanguageViewProps = ReturnType<typeof useSettingsLanguageState>;

export const SettingsLanguageView = ({ onSelect, value }: SettingsLanguageViewProps) => (
  <Page backLabel={t(`settingsSubscription.back`)} backLink="/settings" title={t(`settings.language`)}>
    <SettingsOptionList
      onSelect={onSelect}
      options={[
        { icon: `🇷🇺`, label: t(`settingsLanguage.ru`), value: `ru` },
        { icon: `🇬🇧`, label: t(`settingsLanguage.en`), value: `en` },
        { icon: `⚙️`, label: t(`settingsLanguage.system`), value: `system` },
      ]}
      selectedValue={value}
    />
  </Page>
);
