import { useRouterGo } from "@snappy/app-router";
import { useAsyncSubmit } from "@snappy/ui";
import { type SubmitEventHandler, useState } from "react";

import { r } from "../../data";
import { Routes } from "../../Routes";

export const useSignInState = () => {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const go = useRouterGo();
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const signIn: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    void wrapSubmit(async () => {
      const result = await r.auth.signIn(username.trim(), password);
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      void go(Routes.user.list, { instant: true });
    });
  };

  return { error, loading, password, setPassword, setUsername, signIn, username };
};
