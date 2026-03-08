import { type SyntheticEvent, useState } from "react";
import { useSearchParams } from "wouter";

import { api, Password, t } from "../core";

export type ResetPasswordFormScreen = `done` | `form` | `invalid`;

export const useResetPasswordFormState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

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

  const screen: ResetPasswordFormScreen = token === `` ? `invalid` : done ? `done` : `form`;

  const formProps =
    screen === `form`
      ? {
          error,
          loading,
          onPasswordChange: setPassword,
          onSubmit: (event: SyntheticEvent<HTMLFormElement>) => {
            void submit(event);
          },
          password,
        }
      : undefined;

  const messageProps =
    screen === `invalid`
      ? {
          lead: t(`resetPage.invalidLinkLead`),
          linkText: t(`resetPage.requestAgain`),
          linkTo: `/forgot-password` as const,
          title: t(`resetPage.invalidLink`),
        }
      : screen === `done`
        ? {
            lead: t(`resetPage.doneLead`),
            linkText: t(`resetPage.loginLink`),
            linkTo: `/login` as const,
            title: t(`resetPage.done`),
          }
        : undefined;

  return { formProps, messageProps, screen };
};
