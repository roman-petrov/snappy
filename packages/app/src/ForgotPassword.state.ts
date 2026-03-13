import type { SyntheticEvent } from "react";

import { useSignalState } from "@snappy/ui";

import { api, t } from "./core";
import { useAsyncSubmit } from "./hooks";

export type ForgotPasswordScreen = `form` | `sent`;

export const useForgotPasswordState = () => {
  const [email, setEmail] = useSignalState(``);
  const [sent, setSent] = useSignalState(false);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void wrapSubmit(async () => {
      const result = await api.forgotPassword(email.trim());
      if (result.status !== `ok`) {
        setError(t(`forgotPage.errors.${result.status}`));

        return;
      }
      setSent(true);
    });
  };

  const screen: ForgotPasswordScreen = sent ? `sent` : `form`;

  return {
    email,
    emailLabel: t(`forgotPage.email`),
    error,
    lead: t(`forgotPage.lead`),
    loading,
    loginLinkText: t(`loginPage.login`),
    messageLead: screen === `sent` ? t(`forgotPage.checkEmailLead`) : undefined,
    messageLinkText: screen === `sent` ? t(`forgotPage.backToLogin`) : undefined,
    messageLinkTo: screen === `sent` ? (`/login` as const) : undefined,
    messageTitle: screen === `sent` ? t(`forgotPage.checkEmail`) : undefined,
    onEmailChange: setEmail,
    onSubmit,
    screen,
    submitButtonText: loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`),
    title: t(`forgotPage.title`),
  };
};
