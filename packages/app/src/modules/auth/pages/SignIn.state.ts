import { useRouterGo } from "@snappy/app-router";
import { Email } from "@snappy/core";
import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import { AppBase } from "../../../AppBase";
import { Auth } from "../../../core";
import { Routes } from "../../../Routes";
import { $signedIn } from "../../../Store";
import { useAuthEmailSend } from "../hooks";

export const useSignInState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [screen, setScreen] = useState<`form` | `unverified`>(`form`);
  const go = useRouterGo();
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const {
    cooldownSec,
    send: resend,
    setError: setResendError,
    startCooldown,
  } = useAuthEmailSend({
    email,
    onSent: () => setScreen(`unverified`),
    request: async () => Auth.sendVerificationEmail(email, AppBase.verifyCallbackUrl),
  });

  const submit = () => {
    if (!Email.valid(email)) {
      setError(`invalidEmail`);

      return;
    }
    void wrapSubmit(async () => {
      const result = await Auth.signIn(email, password);
      if (result.status === `emailNotVerified`) {
        setScreen(`unverified`);

        return;
      }
      if (result.status === `tooManyRequests`) {
        setScreen(`unverified`);
        startCooldown(result.retryAfterSec);
        setResendError(`tooManyRequests`);

        return;
      }
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      $signedIn.set(true);
      void go(Routes.$.home, { instant: true });
    });
  };

  const back = () => {
    setScreen(`form`);
    setError(undefined);
    setResendError(undefined);
  };

  const submitDisabled = loading || password === ``;

  return {
    back,
    cooldownSec,
    email,
    error,
    loading,
    password,
    resend,
    screen,
    setEmail,
    setPassword,
    submit,
    submitDisabled,
  };
};
