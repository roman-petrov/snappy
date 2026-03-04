import { ResetPasswordForm, t } from "@snappy/app";

import { AuthPage } from "./AuthPage";

export const ResetPassword = () => (
  <AuthPage title={t(`resetPage.title`)}>
    <ResetPasswordForm />
  </AuthPage>
);
