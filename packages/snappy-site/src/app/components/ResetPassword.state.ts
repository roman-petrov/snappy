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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`resetPage.passwordRule`, { min: passwordMinLength }));

      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword(token, password);
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t(`resetPage.error`));

        return;
      }
      setDone(true);
    } catch {
      setError(t(`resetPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return {
    done,
    error,
    loading,
    onPasswordChange: setPassword,
    onSubmit: (e: React.FormEvent) => {
      void submit(e);
    },
    password,
    token,
  };
};
