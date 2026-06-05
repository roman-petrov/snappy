/* jscpd:ignore-start */
import { Button, Input, NewPasswordInput } from "@snappy/ui";

import type { useSignUpState } from "./SignUp.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, AuthSubmitActions } from "./components";

export type SignUpViewProps = ReturnType<typeof useSignUpState>;

export const SignUpView = ({
  email,
  error,
  loading,
  password,
  setEmail,
  setPassword,
  submit,
  submitDisabled,
}: SignUpViewProps) => (
  <AuthForm submit={submit} title={t(`auth.signUp.title`)}>
    <Input
      autoComplete="email"
      label={t(`auth.signUp.email`)}
      onChange={setEmail}
      required
      type="email"
      value={email}
    />
    <NewPasswordInput
      disabled={loading}
      label={t(`auth.signUp.password`)}
      onChange={setPassword}
      required
      value={password}
    />
    <AuthSubmitActions
      disabled={submitDisabled}
      error={error === undefined ? `` : t(`auth.signUp.errors.${error}`)}
      loading={loading}
      submit={t(`auth.signUp.submit`)}
      submitting={t(`auth.signUp.submitting`)}
    >
      <Button link={Routes.signIn} text={t(`auth.signIn.title`)} />
    </AuthSubmitActions>
  </AuthForm>
);
/* jscpd:ignore-end */
