import { useState } from "react";

import { api } from "../core/Api";
import { t } from "../core/Locale";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(``);
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`forgotPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return { email, error, loading, onEmailChange: setEmail, onSubmit, sent };
};
