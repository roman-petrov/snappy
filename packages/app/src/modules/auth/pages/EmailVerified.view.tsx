import { Button, FilledIcon, Page, Spinner, Text, Title } from "@snappy/ui";
import { Check } from "lucide-react";

import type { useEmailVerifiedState } from "./EmailVerified.state";

import { FormActions, HeaderContent } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import { MessageWithLink } from "../components";
import styles from "./EmailVerified.module.scss";

export type EmailVerifiedViewProps = ReturnType<typeof useEmailVerifiedState>;

export const EmailVerifiedView = ({ failedReason, home, screen }: EmailVerifiedViewProps) => (
  <Page fill trailing={<HeaderContent />}>
    <div className={styles.panel}>
      {screen === `loading` ? (
        <div className={styles.status}>
          <Spinner />
          <Text text={t(`auth.emailVerified.loading`)} typography="large" />
        </div>
      ) : undefined}
      {screen === `done` ? (
        <div className={styles.status}>
          <FilledIcon color="success" icon={Check} size="md" />
          <Title lead={t(`auth.emailVerified.lead`)} title={t(`auth.emailVerified.title`)} />
          <FormActions>
            <Button onClick={home} text={t(`auth.emailVerified.home`)} />
          </FormActions>
        </div>
      ) : undefined}
      {screen === `failed` ? (
        <MessageWithLink
          lead={t(`auth.emailVerified.failed.${failedReason}.lead`)}
          linkText={t(`auth.signIn.title`)}
          linkTo={Routes.auth.signIn}
          title={t(`auth.emailVerified.failed.${failedReason}.title`)}
        />
      ) : undefined}
    </div>
  </Page>
);
