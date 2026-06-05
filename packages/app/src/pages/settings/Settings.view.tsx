/* jscpd:ignore-start */
import { Page, SwitchDisplay } from "@snappy/ui";
import {
  CloudFog,
  CreditCard,
  Image,
  KeyRound,
  Languages,
  MessageCircle,
  Mic,
  Palette,
  Type,
  User,
} from "lucide-react";

import type { useSettingsState } from "./Settings.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  aiTunnelEnd,
  balanceEnd,
  email,
  fog,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  locale,
  theme,
  toggleFog,
  typeWriterSpeed,
}: SettingsViewProps) => (
  <Page back title={t(`settings.root.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.root.accountGroup`)}>
        <SettingsCardRow
          bottom={email}
          icon={User}
          link={Routes.settings.profile.root}
          text={t(`settings.root.profile`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.root.systemGroup`)}>
        <SettingsCardRow
          bottom={t(`settings.theme.${theme}`)}
          icon={Palette}
          link={Routes.settings.theme}
          text={t(`settings.root.theme`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          icon={CloudFog}
          onClick={toggleFog}
          right={<SwitchDisplay checked={fog} />}
          text={t(`settings.root.fogBackground`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={t(`settings.language.${locale}`)}
          icon={Languages}
          link={Routes.settings.language}
          text={t(`settings.root.language`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={t(`settings.typeWriterSpeed.${typeWriterSpeed ?? `stream`}`)}
          icon={Type}
          link={Routes.settings.typeWriterSpeed}
          text={t(`settings.root.typeWriterSpeed`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.root.modelsGroup`)}>
        <SettingsCardRow
          bottom={aiTunnelEnd}
          icon={KeyRound}
          link={Routes.settings.aiTunnel}
          text={t(`settings.root.aiTunnel`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmChatEnd}
          icon={MessageCircle}
          link={Routes.settings.models.chat}
          text={t(`settings.models.chat.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmImageEnd}
          icon={Image}
          link={Routes.settings.models.image}
          text={t(`settings.models.image.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmSpeechEnd}
          icon={Mic}
          link={Routes.settings.models.speech}
          text={t(`settings.models.speech.title`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow
          bottom={balanceEnd}
          icon={CreditCard}
          link={Routes.balance.topUp}
          text={t(`settings.root.balance`)}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
/* jscpd:ignore-end */
