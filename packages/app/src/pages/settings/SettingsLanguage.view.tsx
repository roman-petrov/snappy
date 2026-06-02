import { Page } from "@snappy/ui";

import type { useSettingsLanguageState } from "./SettingsLanguage.state";

import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsLanguageViewProps = ReturnType<typeof useSettingsLanguageState>;

export const SettingsLanguageView = (props: SettingsLanguageViewProps) => (
  <Page back title={t(`settings.language.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: { emoji: `🇷🇺` }, label: t(`settings.language.ru`), value: `ru` },
        { icon: { emoji: `🇬🇧` }, label: t(`settings.language.en`), value: `en` },
        { icon: `settings`, label: t(`settings.language.system`), value: `system` },
      ]}
    />
  </Page>
);
