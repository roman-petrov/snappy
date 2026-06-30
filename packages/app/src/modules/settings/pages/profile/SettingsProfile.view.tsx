import { FilledIcon, Page } from "@snappy/ui";
import { CreditCard, KeyRound, LogOut, Mail } from "lucide-react";

import type { useSettingsProfileState } from "./SettingsProfile.state";

import { t } from "../../../../core";
import { Routes } from "../../../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "../../components";

export type SettingsProfileViewProps = ReturnType<typeof useSettingsProfileState>;

export const SettingsProfileView = ({ balanceEnd, email, signOut }: SettingsProfileViewProps) => (
  <Page back title={t(`settings.profile.title`)}>
    <SettingsCards>
      <SettingsCard>
        <SettingsCardRow
          bottom={email}
          disabled
          icon={<FilledIcon color="accentPink" icon={Mail} />}
          text={t(`settings.profile.email`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          bottom={balanceEnd}
          icon={<FilledIcon color="accentOrange" icon={CreditCard} />}
          link={Routes.settings.profile.topUp}
          text={t(`settings.profile.balance`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          icon={<FilledIcon color="accentViolet" icon={KeyRound} />}
          link={Routes.settings.profile.password}
          text={t(`settings.profile.password.title`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow
          icon={<FilledIcon color="accentMagenta" icon={LogOut} />}
          onClick={signOut}
          text={t(`settings.profile.signOut`)}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
