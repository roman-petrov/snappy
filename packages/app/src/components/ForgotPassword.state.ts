import { type SyntheticEvent, useState } from "react";

import { api, t } from "../core";
import { useAsyncSubmit } from "../hooks";

export const useForgotPasswordState = () => {
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

  return { email, error, loading, onEmailChange: setEmail, onSubmit, sent };
};
