import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { api } from "../core/Api";
import { t } from "../core/Locale";
import { passwordMinLength, passwordValid } from "../core/Password";

export const useResetPasswordState = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`resetPage.passwordRule`, { min: passwordMinLength }));

      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`resetPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return {
    done,
    error,
    loading,
    onPasswordChange: setPassword,
    onSubmit: (event: React.FormEvent) => {
      void submit(event);
    },
    password,
    token,
  };
};
