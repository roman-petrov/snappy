import { SwitchDisplay } from "@snappy/ui";

import type { useSettingsState } from "./Settings.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  aiTunnelEnd,
  balanceEnd,
  fog,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  locale,
  theme,
  toggleFog,
}: SettingsViewProps) => (
  <Page title={t(`settings.root.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.root.systemGroup`)}>
        <SettingsCardRow
          end={`${t(`settings.theme.${theme}`)} ›`}
          icon="palette"
          link={Routes.settings.theme}
          text={t(`settings.root.theme`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={<SwitchDisplay checked={fog} />}
          icon="blur_on"
          onClick={toggleFog}
          text={t(`settings.root.fogBackground`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={`${t(`settings.language.${locale}`)} ›`}
          icon="language"
          link={Routes.settings.language}
          text={t(`settings.root.language`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.root.modelsGroup`)}>
        <SettingsCardRow
          end={aiTunnelEnd}
          icon="vpn_key"
          link={Routes.settings.aiTunnel}
          text={t(`settings.root.aiTunnel`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={llmChatEnd}
          icon="chat"
          link={Routes.settings.models.chat}
          text={t(`settings.models.chat.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={llmImageEnd}
          icon="image"
          link={Routes.settings.models.image}
          text={t(`settings.models.image.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={llmSpeechEnd}
          icon="record_voice_over"
          link={Routes.settings.models.speech}
          text={t(`settings.models.speech.title`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow
          end={balanceEnd}
          icon="credit_card"
          link={Routes.balance.topUp}
          text={t(`settings.root.balance`)}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
