import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Auth, Password } from "../../core";

export const useResetPasswordState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();
  const submitDisabled = loading || !Password.valid(password);

  const submit = () => {
    void wrapSubmit(async () => {
      const result = await Auth.resetPassword(token, password);
      if (result.status !== `ok`) {
        setError({ key: `auth.resetPassword.errors.${result.status}` });

        return;
      }
      setDone(true);
    });
  };

  const screen = token === `` ? (`invalid` as const) : done ? (`done` as const) : (`form` as const);

  return { error, loading, password, screen, setPassword, submit, submitDisabled };
};
