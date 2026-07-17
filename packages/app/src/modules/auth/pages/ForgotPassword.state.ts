import { useState } from "react";

import { AppBase } from "../../../AppBase";
import { r } from "../../../data";
import { useAuthEmailSend } from "../hooks";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);

  const { send } = useAuthEmailSend({
    email,
    onSent: () => setSent(true),
    request: async () => r.auth.requestPasswordReset(email, AppBase.resetPasswordUrl),
  });

  return { email, send, sent, setEmail };
};
