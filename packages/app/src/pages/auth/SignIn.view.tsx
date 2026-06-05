/* jscpd:ignore-start */
import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useSignInState } from "./SignIn.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, AuthSubmitActions } from "./components";

export type SignInViewProps = ReturnType<typeof useSignInState>;

export const SignInView = ({
  email,
  error,
  loading,
  password,
  setEmail,
  setPassword,
  submit,
  submitDisabled,
}: SignInViewProps) => (
  <AuthForm submit={submit} title={t(`auth.signIn.title`)}>
    <Input
      autoComplete="email"
      label={t(`auth.signIn.email`)}
      onChange={setEmail}
      required
      type="email"
      value={email}
    />
    <PasswordInput
      autoComplete="current-password"
      disabled={loading}
      label={t(`auth.signIn.password`)}
      onChange={setPassword}
      required
      value={password}
    />
    <AuthSubmitActions
      disabled={submitDisabled}
      error={error === undefined ? `` : t(`auth.signIn.errors.${error}`)}
      loading={loading}
      submit={t(`auth.signIn.submit`)}
      submitting={t(`auth.signIn.submitting`)}
    >
      <Button link={Routes.forgotPassword} text={t(`auth.signIn.forgotPassword`)} />
      <Button link={Routes.signUp} text={t(`auth.signIn.signUpLink`)} />
    </AuthSubmitActions>
  </AuthForm>
);
/* jscpd:ignore-end */
