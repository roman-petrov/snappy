import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { api, Password, t } from "../../core";

export const useResetPasswordState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
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

  const screen = token === `` ? (`invalid` as const) : done ? (`done` as const) : (`form` as const);

  return { error, loading, minLength: Password.minLength, password, screen, setPassword, submit };
};
