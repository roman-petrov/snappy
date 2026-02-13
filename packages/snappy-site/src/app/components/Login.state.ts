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

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(``);
    setLoading(true);
    try {
      const { token } = await api.login(email.trim(), password);
      setToken(token, remember);
      navigate(`/`, { replace: true, viewTransition: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`loginPage.errorNetwork`));
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
