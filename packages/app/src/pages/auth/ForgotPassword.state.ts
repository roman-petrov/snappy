import { useState } from "react";

import { AppBase } from "../../AppBase";
import { Auth } from "../../core";
import { useAuthEmailSend } from "./hooks";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);

  const { send } = useAuthEmailSend({
    email,
    onSent: () => setSent(true),
    request: async () => Auth.requestPasswordReset(email, AppBase.resetPasswordUrl),
  });

  return { email, send, sent, setEmail };
};
