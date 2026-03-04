import { ForgotPasswordForm, t } from "@snappy/app";
import { Panel } from "@snappy/ui";

export const ForgotPassword = () => (
  <Panel lead={t(`forgotPage.lead`)} title={t(`forgotPage.title`)}>
    <ForgotPasswordForm />
  </Panel>
);
