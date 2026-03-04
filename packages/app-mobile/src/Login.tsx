import { LoginForm, t } from "@snappy/app";

import { AuthPage } from "./AuthPage";

export const Login = () => (
  <AuthPage title={t(`loginPage.title`)}>
    <LoginForm />
  </AuthPage>
);
