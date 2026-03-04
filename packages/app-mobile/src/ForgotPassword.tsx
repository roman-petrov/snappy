import { ForgotPasswordForm, t } from "@snappy/app";

import { AuthPage } from "./AuthPage";

export const ForgotPassword = () => (
  <AuthPage title={t(`forgotPage.title`)}>
    <ForgotPasswordForm />
  </AuthPage>
);
