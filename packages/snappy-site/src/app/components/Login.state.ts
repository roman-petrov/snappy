import { type SyntheticEvent, useState } from "react";

import { api } from "../core/Api";
import { useAsyncSubmit, useRunAfterAuth } from "../hooks";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [remember, setRemember] = useState(false);
  const { error, loading, wrapSubmit } = useAsyncSubmit({ errorKey: `loginPage.errorNetwork` });
  const runAfterAuth = useRunAfterAuth(wrapSubmit);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAfterAuth(async () => {
      await api.login(email.trim(), password);
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
