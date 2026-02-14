import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../core/Api";
import { setToken } from "../core/Auth";
import { useAsyncSubmit } from "../core/hooks";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [remember, setRemember] = useState(false);
  const { error, loading, wrapSubmit } = useAsyncSubmit({ errorKey: `loginPage.errorNetwork` });
  const navigate = useNavigate();

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void wrapSubmit(async () => {
      const { token } = await api.login(email.trim(), password);
      setToken(token, remember);
      void navigate(`/`, { replace: true, viewTransition: true });
    });
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
