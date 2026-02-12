import { useState } from "react";

import { api } from "../core/Api";
import { t } from "../core/Locale";

export const useForgotPasswordState = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    setLoading(true);
    try {
      const res = await api.forgotPassword(email.trim());
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t(`forgotPage.error`));

        return;
      }
      setSent(true);
    } catch {
      setError(t(`forgotPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    error,
    loading,
    onEmailChange: setEmail,
    onSubmit,
    sent,
  };
};
