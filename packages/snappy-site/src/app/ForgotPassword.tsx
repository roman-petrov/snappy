import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../shared/Button";
import { api } from "./Api";
import { t } from "./Locale";
import styles from "./Login.module.css";

export const ForgotPassword = () => {
  const [email, setEmail] = useState(``);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
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

  if (sent) {
    return (
      <div className={styles[`authPage`]}>
        <div className={styles[`authPanel`]}>
          <h1 className={styles[`title`]}>{t(`forgotPage.checkEmail`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.checkEmailLead`)}</p>
          <div className={styles[`actions`]}>
            <Link to="/login" className={styles[`link`]}>
              {t(`forgotPage.backToLogin`)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles[`authPage`]}>
      <div className={styles[`authPanel`]}>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(`forgotPage.title`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.lead`)}</p>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="forgot-email">
              {t(`forgotPage.email`)}
            </label>
            <input
              id="forgot-email"
              type="email"
              className={styles[`input`]}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading}>
              {loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
            </Button>
            <Link to="/login" className={styles[`link`]}>
              {t(`forgotPage.loginLink`)}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
