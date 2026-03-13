import type { SyntheticEvent } from "react";

import { useSignalState } from "@snappy/ui";

import { api, t } from "./core";
import { useAsyncSubmit, useRunAfterAuth } from "./hooks";

export const useLoginState = () => {
  const [email, setEmail] = useSignalState(``);
  const [password, setPassword] = useSignalState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();
  const runAfterAuth = useRunAfterAuth(wrapSubmit, setError, t, `loginPage`);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAfterAuth(async () => api.login(email.trim(), password));
  };

  return {
    email,
    emailLabel: t(`loginPage.email`),
    error,
    forgotPasswordText: t(`loginPage.forgotPassword`),
    hidePasswordLabel: t(`passwordInput.hidePassword`),
    loading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit,
    password,
    passwordLabel: t(`loginPage.password`),
    registerLinkText: t(`loginPage.registerLink`),
    showPasswordLabel: t(`passwordInput.showPassword`),
    submitButtonText: loading ? t(`loginPage.submitting`) : t(`loginPage.logIn`),
    title: t(`loginPage.login`),
  };
};
