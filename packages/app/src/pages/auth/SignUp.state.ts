import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import { AppBase } from "../../AppBase";
import { Auth, Password } from "../../core";
import { useAuthEmailSend } from "./hooks";

export const useSignUpState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [sent, setSent] = useState(false);

  const { send: resend, startCooldown } = useAuthEmailSend({
    request: async () => Auth.sendVerificationEmail(email, AppBase.verifyCallbackUrl),
  });

  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const signUp = () => {
    void wrapSubmit(async () => {
      const result = await Auth.signUp(email, password, AppBase.verifyCallbackUrl);
      if (result.status === `tooManyRequests`) {
        startCooldown(result.retryAfterSec);
        setError(`tooManyRequests`);

        return;
      }
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      setSent(true);
      startCooldown();
    });
  };

  const send = sent ? resend : { ...resend, disabled: loading || resend.disabled, error, loading, onSend: signUp };
  const submitDisabled = send.loading || !Password.valid(password) || send.disabled;

  return { email, password, send, sent, setEmail, setPassword, submitDisabled };
};
