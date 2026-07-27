import { FilledIcon, Page } from "@snappy/ui";
import { Eye, Globe, Image, KeyRound, Languages, MessageCircle, Mic, Palette, Type, User } from "lucide-react";

import type { useSettingsState } from "./Settings.state";

import { TabHeaderContent } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsFeedback } from "../components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  aiTunnelDirect,
  email,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  llmVisionEnd,
  llmWebSearchEnd,
  locale,
  theme,
  typeWriterSpeed,
}: SettingsViewProps) => (
  <Page tab title={t(`settings.title`)} trailing={<TabHeaderContent />}>
    <SettingsCards>
      <SettingsCard title={t(`settings.accountGroup`)}>
        <SettingsCardRow
          bottom={email}
          icon={<FilledIcon color="accentIndigo" icon={User} />}
          link={Routes.settings.profile.root}
          text={t(`settings.profile.title`)}
        />
        <SettingsFeedback />
      </SettingsCard>
      <SettingsCard title={t(`settings.systemGroup`)}>
        <SettingsCardRow
          bottom={t(`settings.theme.${theme}`)}
          icon={<FilledIcon color="accentOrange" icon={Palette} />}
          link={Routes.settings.theme}
          text={t(`settings.theme.title`)}
        />
        <SettingsCardRow
          bottom={t(`settings.language.${locale}`)}
          icon={<FilledIcon color="accentPink" icon={Languages} />}
          link={Routes.settings.language}
          text={t(`settings.language.title`)}
        />
        <SettingsCardRow
          bottom={t(`settings.typeWriterSpeed.${typeWriterSpeed ?? `stream`}`)}
          icon={<FilledIcon color="accentPlum" icon={Type} />}
          link={Routes.settings.typeWriterSpeed}
          text={t(`settings.typeWriterSpeed.title`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.modelsGroup`)}>
        <SettingsCardRow
          bottom={
            aiTunnelDirect === undefined
              ? undefined
              : t(aiTunnelDirect ? `settings.aiTunnel.mode.direct` : `settings.aiTunnel.mode.proxy`)
          }
          icon={<FilledIcon color="accentMagenta" icon={KeyRound} />}
          link={Routes.settings.aiTunnel}
          text={t(`settings.aiTunnel.title`)}
        />
        <SettingsCardRow
          bottom={llmChatEnd}
          icon={<FilledIcon color="accentIndigo" icon={MessageCircle} />}
          link={Routes.settings.models.chat}
          text={t(`settings.models.chat.title`)}
        />
        <SettingsCardRow
          bottom={llmImageEnd}
          icon={<FilledIcon color="accentOrange" icon={Image} />}
          link={Routes.settings.models.image}
          text={t(`settings.models.image.title`)}
        />
        <SettingsCardRow
          bottom={llmVisionEnd}
          icon={<FilledIcon color="accentViolet" icon={Eye} />}
          link={Routes.settings.models.vision}
          text={t(`settings.models.vision.title`)}
        />
        <SettingsCardRow
          bottom={llmWebSearchEnd}
          icon={<FilledIcon color="accentPurple" icon={Globe} />}
          link={Routes.settings.models.webSearch}
          text={t(`settings.models.webSearch.title`)}
        />
        <SettingsCardRow
          bottom={llmSpeechEnd}
          icon={<FilledIcon color="accentFuchsia" icon={Mic} />}
          link={Routes.settings.models.speech}
          text={t(`settings.models.speech.title`)}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
