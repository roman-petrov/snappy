import { Button, SwitchDisplay } from "@snappy/ui";

import type { useSettingsState } from "./Settings.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";
import styles from "./Settings.module.scss";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  aiTunnelEnd,
  balanceEnd,
  fog,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  locale,
  logoutOnClick,
  theme,
  toggleFog,
}: SettingsViewProps) => (
  <Page title={t(`settings.root.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.root.systemGroup`)}>
        <SettingsCardRow
          bottom={t(`settings.theme.${theme}`)}
          icon="palette"
          link={Routes.settings.theme}
          text={t(`settings.root.theme`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          icon="blur_on"
          onClick={toggleFog}
          right={<SwitchDisplay checked={fog} />}
          text={t(`settings.root.fogBackground`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={t(`settings.language.${locale}`)}
          icon="language"
          link={Routes.settings.language}
          text={t(`settings.root.language`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.root.modelsGroup`)}>
        <SettingsCardRow
          bottom={aiTunnelEnd}
          icon="vpn_key"
          link={Routes.settings.aiTunnel}
          text={t(`settings.root.aiTunnel`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmChatEnd}
          icon="chat"
          link={Routes.settings.models.chat}
          text={t(`settings.models.chat.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmImageEnd}
          icon="image"
          link={Routes.settings.models.image}
          text={t(`settings.models.image.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmSpeechEnd}
          icon="record_voice_over"
          link={Routes.settings.models.speech}
          text={t(`settings.models.speech.title`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow
          bottom={balanceEnd}
          icon="credit_card"
          link={Routes.balance.topUp}
          text={t(`settings.root.balance`)}
        />
      </SettingsCard>
    </SettingsCards>
    <div className={styles.logout}>
      <Button onClick={logoutOnClick} text={t(`common.logout`)} />
    </div>
  </Page>
);
