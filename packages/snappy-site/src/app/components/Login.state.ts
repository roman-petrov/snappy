import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../core/Api";
import { setToken } from "../core/Auth";
import { t } from "../core/Locale";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      const data = (await res.json()) as { error?: string; token?: string };
      if (!res.ok) {
        setError(data.error ?? t(`loginPage.errorLogin`));

        return;
      }
      if (data.token) {
        setToken(data.token, remember);
        navigate(`/`, { replace: true, viewTransition: true });
      }
    } catch {
      setError(t(`loginPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    error,
    loading,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onRememberChange: setRemember,
    onSubmit,
    password,
    remember,
  };
};
