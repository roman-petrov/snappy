import { Button, FilledIcon, Spinner, StatusPage, SystemButtons } from "@snappy/ui";
import { Check, CircleAlert } from "lucide-react";

import type { useEmailVerifiedState } from "./EmailVerified.state";

import { t } from "../../../core";
import { Routes } from "../../../Routes";

export type EmailVerifiedViewProps = ReturnType<typeof useEmailVerifiedState>;

export const EmailVerifiedView = ({ failedReason, home, screen }: EmailVerifiedViewProps) =>
  screen === `loading` ? (
    <StatusPage icon={<Spinner size="xxxl" />} title={t(`auth.emailVerified.loading`)} trailing={<SystemButtons />} />
  ) : screen === `done` ? (
    <StatusPage
      celebrate
      icon={<FilledIcon color="success" icon={Check} size="xxxl" />}
      lead={t(`auth.emailVerified.lead`)}
      title={t(`auth.emailVerified.title`)}
      trailing={<SystemButtons />}
    >
      <Button onClick={home} text={t(`auth.emailVerified.home`)} type="primary" />
    </StatusPage>
  ) : (
    <StatusPage
      icon={<FilledIcon color="error" icon={CircleAlert} size="xxxl" />}
      lead={t(`auth.emailVerified.failed.${failedReason}.lead`)}
      title={t(`auth.emailVerified.failed.${failedReason}.title`)}
      trailing={<SystemButtons />}
    >
      <Button link={Routes.auth.signIn} text={t(`auth.signIn.title`)} type="primary" />
    </StatusPage>
  );
