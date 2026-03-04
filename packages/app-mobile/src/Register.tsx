import { RegisterForm, t } from "@snappy/app";

import { AuthPage } from "./AuthPage";

export const Register = () => (
  <AuthPage title={t(`registerPage.title`)}>
    <RegisterForm />
  </AuthPage>
);
