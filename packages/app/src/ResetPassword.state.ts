import type { SyntheticEvent } from "react";

import { useSignalState } from "@snappy/ui";
import { useSearchParams } from "wouter";

import { api, Password, t } from "./core";

export type ResetPasswordScreen = `done` | `form` | `invalid`;

export const useResetPasswordState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useSignalState(``);
  const [done, setDone] = useSignalState(false);
  const [error, setError] = useSignalState(``);
  const [loading, setLoading] = useSignalState(false);

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(``);
    if (!Password.valid(password)) {
      setError(t(`resetPage.passwordRule`, { min: Password.minLength }));

      return;
    }
    setLoading(true);
    const result = await api.resetPassword(token, password);
    setLoading(false);
    if (result.status !== `ok`) {
      setError(t(`resetPage.errors.${result.status}`));

      return;
    }
    setDone(true);
  };

  const screen: ResetPasswordScreen = token === `` ? `invalid` : done ? `done` : `form`;

  const messageLead =
    screen === `invalid` ? t(`resetPage.invalidLinkLead`) : screen === `done` ? t(`resetPage.doneLead`) : undefined;

  const messageLinkText =
    screen === `invalid` ? t(`resetPage.requestAgain`) : screen === `done` ? t(`loginPage.login`) : undefined;

  const messageLinkTo =
    screen === `invalid` ? (`/forgot-password` as const) : screen === `done` ? (`/login` as const) : undefined;

  const messageTitle =
    screen === `invalid` ? t(`resetPage.invalidLink`) : screen === `done` ? t(`resetPage.done`) : undefined;

  return {
    error,
    hidePasswordLabel: t(`passwordInput.hidePassword`),
    loading,
    messageLead,
    messageLinkText,
    messageLinkTo,
    messageTitle,
    minLength: Password.minLength,
    onPasswordChange: setPassword,
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => {
      void submit(event);
    },
    password,
    passwordLabel: t(`resetPage.passwordLabel`, { min: Password.minLength }),
    screen,
    showPasswordLabel: t(`passwordInput.showPassword`),
    submitButtonText: loading ? t(`resetPage.submitting`) : t(`resetPage.submit`),
    title: t(`resetPage.title`),
  };
};
