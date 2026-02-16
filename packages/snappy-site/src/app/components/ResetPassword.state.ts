import { type SyntheticEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Password } from "../core";
import { api } from "../core/Api";
import { t } from "../core/Locale";

export const useResetPasswordState = () => {
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

  return {
    done,
    error,
    loading,
    onPasswordChange: setPassword,
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => {
      void submit(event);
    },
    password,
    token,
  };
};
