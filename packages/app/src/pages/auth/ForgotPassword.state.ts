import { useState } from "react";

import { api } from "../../core";
import { useAsyncSubmit } from "../../hooks";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const submit = () => {
    void wrapSubmit(async () => {
      const result = await api.forgotPassword(email.trim());
      if (result.status !== `ok`) {
        setError({ key: `forgotPage.errors.${result.status}` });

        return;
      }
      setSent(true);
    });
  };

  const screen = sent ? (`sent` as const) : (`form` as const);

  return { email, error, loading, screen, setEmail, submit };
};
