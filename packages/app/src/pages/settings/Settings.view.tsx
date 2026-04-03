import { SwitchDisplay } from "@snappy/ui";

import type { useSettingsState } from "./Settings.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  balanceEnd,
  fog,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  locale,
  theme,
  toggleFog,
}: SettingsViewProps) => (
  <Page title={t(`settings.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.systemGroup`)}>
        <SettingsCardRow
          end={`${t(`settingsTheme.${theme}`)} ›`}
          icon="🎨"
          link={Routes.settings.theme}
          text={t(`settings.appearance`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={<SwitchDisplay checked={fog} />}
          icon="🌫️"
          onClick={toggleFog}
          text={t(`settings.fogBackground`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={`${t(`settingsLanguage.${locale}`)} ›`}
          icon="🌐"
          link={Routes.settings.language}
          text={t(`settings.language`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.modelsGroup`)}>
        <SettingsCardRow
          end={llmChatEnd}
          icon="💬"
          link={Routes.settings.models.chat}
          text={t(`settings.modelsChat`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={llmImageEnd}
          icon="🖼️"
          link={Routes.settings.models.image}
          text={t(`settings.modelsImage`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={llmSpeechEnd}
          icon="🎙️"
          link={Routes.settings.models.speech}
          text={t(`settings.modelsSpeech`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow end={balanceEnd} icon="💳" link={Routes.balance.topUp} text={t(`settings.balance`)} />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
