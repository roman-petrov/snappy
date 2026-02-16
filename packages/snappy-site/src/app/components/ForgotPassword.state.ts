import { type SyntheticEvent, useState } from "react";

import { api } from "../core";
import { useAsyncSubmit } from "../hooks";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
  const { error, loading, wrapSubmit } = useAsyncSubmit({ errorKey: `forgotPage.errorNetwork` });

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void wrapSubmit(async () => {
      await api.forgotPassword(email.trim());
      setSent(true);
    });
  };

  return { email, error, loading, onEmailChange: setEmail, onSubmit, sent };
};
