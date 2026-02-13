import { type SyntheticEvent, useState } from "react";
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

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(``);
    setLoading(true);
    try {
      const { token } = await api.login(email.trim(), password);
      setToken(token, remember);
      void navigate(`/`, { replace: true, viewTransition: true });
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : t(`loginPage.errorNetwork`));
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
