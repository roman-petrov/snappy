import type { SyntheticEvent } from "react";

import { useSignalState } from "@snappy/ui";

import { api, t } from "../core";
import { useAsyncSubmit, useRunAfterAuth } from "../hooks";

export const useLoginFormState = () => {
  const [email, setEmail] = useSignalState(``);
  const [password, setPassword] = useSignalState(``);
  const [remember, setRemember] = useSignalState(false);
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
