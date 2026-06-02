import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useSignInState } from "./SignIn.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions } from "./components";

export type SignInViewProps = ReturnType<typeof useSignInState>;

export const SignInView = ({ email, error, loading, password, setEmail, setPassword, submit }: SignInViewProps) => (
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
    <FormErrorAndActions error={error === undefined ? `` : t(`auth.signIn.errors.${error}`)}>
      <Button
        disabled={loading}
        submit
        text={loading ? t(`auth.signIn.submitting`) : t(`auth.signIn.submit`)}
        type="primary"
      />
      <Button link={Routes.forgotPassword} text={t(`auth.signIn.forgotPassword`)} />
      <Button link={Routes.signUp} text={t(`auth.signIn.signUpLink`)} />
    </FormErrorAndActions>
  </AuthForm>
);
