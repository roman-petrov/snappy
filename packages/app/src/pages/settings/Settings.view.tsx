import { FilledIcon, Page } from "@snappy/ui";
import { Eye, Image, KeyRound, Languages, MessageCircle, Mic, Palette, Type, User } from "lucide-react";

import type { useSettingsState } from "./Settings.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({
  aiTunnelEnd,
  email,
  llmChatEnd,
  llmImageEnd,
  llmSpeechEnd,
  llmVisionEnd,
  locale,
  theme,
  typeWriterSpeed,
}: SettingsViewProps) => (
  <Page back title={t(`settings.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.accountGroup`)}>
        <SettingsCardRow
          bottom={email}
          icon={<FilledIcon color="accentIndigo" icon={User} />}
          link={Routes.settings.profile.root}
          text={t(`settings.profile.title`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.systemGroup`)}>
        <SettingsCardRow
          bottom={t(`settings.theme.${theme}`)}
          icon={<FilledIcon color="accentOrange" icon={Palette} />}
          link={Routes.settings.theme}
          text={t(`settings.theme.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={t(`settings.language.${locale}`)}
          icon={<FilledIcon color="accentPink" icon={Languages} />}
          link={Routes.settings.language}
          text={t(`settings.language.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={t(`settings.typeWriterSpeed.${typeWriterSpeed ?? `stream`}`)}
          icon={<FilledIcon color="accentPlum" icon={Type} />}
          link={Routes.settings.typeWriterSpeed}
          text={t(`settings.typeWriterSpeed.title`)}
        />
      </SettingsCard>
      <SettingsCard title={t(`settings.modelsGroup`)}>
        <SettingsCardRow
          bottom={aiTunnelEnd}
          icon={<FilledIcon color="accentMagenta" icon={KeyRound} />}
          link={Routes.settings.aiTunnel}
          text={t(`settings.aiTunnel.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmChatEnd}
          icon={<FilledIcon color="accentIndigo" icon={MessageCircle} />}
          link={Routes.settings.models.chat}
          text={t(`settings.models.chat.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmImageEnd}
          icon={<FilledIcon color="accentOrange" icon={Image} />}
          link={Routes.settings.models.image}
          text={t(`settings.models.image.title`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={llmVisionEnd}
          icon={<FilledIcon color="accentViolet" icon={Eye} />}
          link={Routes.settings.models.vision}
          text={t(`settings.models.vision.title`)}
        />
        <SettingsCardSeparator />
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
