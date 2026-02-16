import { type SyntheticEvent, useState } from "react";

import { api, t } from "../core";
import { useAsyncSubmit, useRunAfterAuth } from "../hooks";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [remember, setRemember] = useState(false);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();
  const runAfterAuth = useRunAfterAuth(wrapSubmit, setError, t, `loginPage`);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAfterAuth(async () => api.login(email.trim(), password));
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
