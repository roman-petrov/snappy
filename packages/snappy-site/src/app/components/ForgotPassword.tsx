import { useState } from "react";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { api } from "../core/Api";
import { Card } from "./Card";
import { t } from "../core/Locale";
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
        <Card className={styles[`authPanel`]} glass narrow>
          <h1 className={styles[`title`]}>{t(`forgotPage.checkEmail`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.checkEmailLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/login">{t(`forgotPage.backToLogin`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles[`authPage`]}>
      <Card className={styles[`authPanel`]} glass narrow>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(`forgotPage.title`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.lead`)}</p>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="forgot-email">
              {t(`forgotPage.email`)}
            </label>
            <input
              autoComplete="email"
              className={styles[`input`]}
              id="forgot-email"
              onChange={e => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              value={email}
            />
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading} primary type="submit">
              {loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
            </Button>
            <AccentLink to="/login">{t(`forgotPage.loginLink`)}</AccentLink>
          </div>
        </form>
      </Card>
    </div>
  );
};
