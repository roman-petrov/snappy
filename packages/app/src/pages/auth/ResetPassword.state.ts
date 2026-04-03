import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { api, Password } from "../../core";
import { useAsyncSubmit } from "../../hooks";

export const useResetPasswordState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const submit = () => {
    if (!Password.valid(password)) {
      setError({ key: `resetPage.passwordRule`, params: { min: Password.minLength } });

      return;
    }
    void wrapSubmit(async () => {
      const result = await api.resetPassword(token, password);
      if (result.status !== `ok`) {
        setError({ key: `resetPage.errors.${result.status}` });

        return;
      }
      setDone(true);
    });
  };

  const screen = token === `` ? (`invalid` as const) : done ? (`done` as const) : (`form` as const);

  return { error, loading, minLength: Password.minLength, password, screen, setPassword, submit };
};
