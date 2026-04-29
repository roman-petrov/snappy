import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useLoginState } from "./Login.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions } from "./components";

export type LoginViewProps = ReturnType<typeof useLoginState>;

export const LoginView = ({ email, error, loading, password, setEmail, setPassword, submit }: LoginViewProps) => (
  <AuthForm submit={submit} title={t(`auth.login.title`)}>
    <Input autoComplete="email" label={t(`auth.login.email`)} onChange={setEmail} required type="email" value={email} />
    <PasswordInput
      autoComplete="current-password"
      disabled={loading}
      label={t(`auth.login.password`)}
      onChange={setPassword}
      required
      value={password}
    />
    <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
      <Button
        disabled={loading}
        submit
        text={loading ? t(`auth.login.submitting`) : t(`auth.login.submit`)}
        type="primary"
      />
      <Button link={Routes.forgotPassword} text={t(`auth.login.forgotPassword`)} />
      <Button link={Routes.register} text={t(`auth.login.registerLink`)} />
    </FormErrorAndActions>
  </AuthForm>
);
