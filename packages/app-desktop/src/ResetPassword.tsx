import { ResetPasswordForm, t } from "@snappy/app";
import { Panel } from "@snappy/ui";

export const ResetPassword = () => (
  <Panel title={t(`resetPage.title`)}>
    <ResetPasswordForm />
  </Panel>
);
