import { type SyntheticEvent, useState } from "react";

import { api, t } from "../core";
import { useAsyncSubmit } from "../hooks";

export type ForgotPasswordFormScreen = `form` | `sent`;

export const useForgotPasswordFormState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
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

  const screen: ForgotPasswordFormScreen = sent ? `sent` : `form`;
  const formProps = screen === `form` ? { email, error, loading, onEmailChange: setEmail, onSubmit } : undefined;

  const messageProps =
    screen === `sent`
      ? {
          lead: t(`forgotPage.checkEmailLead`),
          linkText: t(`forgotPage.backToLogin`),
          linkTo: `/login` as const,
          title: t(`forgotPage.checkEmail`),
        }
      : undefined;

  return { formProps, messageProps, screen };
};
