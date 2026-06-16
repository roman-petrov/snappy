import { useAsyncSubmit, useRouterQuery } from "@snappy/ui";
import { useState } from "react";

import { Auth, Password } from "../../core";

export const useResetPasswordState = () => {
  const query = useRouterQuery();
  const token = query.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [confirmPassword, setConfirmPassword] = useState(``);
  const [done, setDone] = useState(false);
  const { error: submitError, loading, setError, wrapSubmit } = useAsyncSubmit<string>();
  const submitDisabled = loading || !Password.valid(password) || password !== confirmPassword;

  const error =
    submitError ?? (confirmPassword.length > 0 && password !== confirmPassword ? `passwordMismatch` : undefined);

  const submit = () => {
    void wrapSubmit(async () => {
      const result = await Auth.resetPassword(token, password);
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      setDone(true);
    });
  };

  const screen = token === `` ? (`invalid` as const) : done ? (`done` as const) : (`form` as const);

  return { confirmPassword, error, loading, password, screen, setConfirmPassword, setPassword, submit, submitDisabled };
};
