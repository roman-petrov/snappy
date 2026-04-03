import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useLoginState } from "./Login.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm } from "./AuthForm";
import { FormErrorAndActions } from "./components";

export type LoginViewProps = ReturnType<typeof useLoginState>;

export const LoginView = ({ email, error, loading, password, setEmail, setPassword, submit }: LoginViewProps) => (
  <AuthForm submit={submit} title={t(`loginPage.login`)}>
    <Input autoComplete="email" label={t(`loginPage.email`)} onChange={setEmail} required type="email" value={email} />
    <PasswordInput
      autoComplete="current-password"
      disabled={loading}
      label={t(`loginPage.password`)}
      onChange={setPassword}
      required
      value={password}
    />
    <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
      <Button
        disabled={loading}
        submit
        text={loading ? t(`loginPage.submitting`) : t(`loginPage.logIn`)}
        type="primary"
      />
      <Button link={Routes.forgotPassword} text={t(`loginPage.forgotPassword`)} />
      <Button link={Routes.register} text={t(`loginPage.registerLink`)} />
    </FormErrorAndActions>
  </AuthForm>
);
