import { Button, Page } from "@snappy/ui";
import { KeyRound, Mail } from "lucide-react";

import type { useSettingsProfileState } from "./SettingsProfile.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { SettingsCard, SettingsCardRow, SettingsCardSeparator } from "./components";
import styles from "./SettingsProfile.module.scss";

export type SettingsProfileViewProps = ReturnType<typeof useSettingsProfileState>;

export const SettingsProfileView = ({ email, signOut }: SettingsProfileViewProps) => (
  <Page back title={t(`settings.profile.title`)}>
    <SettingsCard>
      <SettingsCardRow bottom={email} disabled icon={Mail} text={t(`settings.profile.email`)} />
      <SettingsCardSeparator />
      <SettingsCardRow
        icon={KeyRound}
        link={Routes.settings.profile.password}
        text={t(`settings.profile.password.title`)}
      />
    </SettingsCard>
    <div className={styles.signOut}>
      <Button onClick={signOut} text={t(`settings.profile.signOut`)} />
    </div>
  </Page>
);
