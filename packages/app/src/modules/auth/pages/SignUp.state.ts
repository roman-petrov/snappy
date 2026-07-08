import { Email, Password } from "@snappy/core";
import { useAsyncSubmit } from "@snappy/ui";
import { CookieConsent } from "@snappy/ui-core";
import { useState } from "react";

import { AppBase } from "../../../AppBase";
import { $data } from "../../../data";
import { useAuthEmailSend } from "../hooks";

export const useSignUpState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [consented, setConsented] = useState(false);
  const [sent, setSent] = useState(false);

  const { send: resend, startCooldown } = useAuthEmailSend({
    email,
    request: async () => $data.auth.sendVerificationEmail(email, AppBase.verifyCallbackUrl),
  });

  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const signUp = () => {
    if (!Email.valid(email)) {
      setError(`invalidEmail`);

      return;
    }
    void wrapSubmit(async () => {
      const result = await $data.auth.signUp(email, password, AppBase.verifyCallbackUrl);
      if (result.status === `tooManyRequests`) {
        startCooldown(result.retryAfterSec);
        setError(`tooManyRequests`);

        return;
      }
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      CookieConsent.accept();
      setSent(true);
      startCooldown();
    });
  };

  const send = sent ? resend : { ...resend, disabled: loading || resend.disabled, error, loading, onSend: signUp };
  const submitDisabled = send.loading || !Password.valid(password) || send.disabled || !consented;

  return { consented, email, password, send, sent, setConsented, setEmail, setPassword, submitDisabled };
};
