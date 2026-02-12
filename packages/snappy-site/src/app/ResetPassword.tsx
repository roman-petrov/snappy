import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../shared/Button";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { t } from "./Locale";
import { passwordValid, PASSWORD_MIN_LENGTH } from "./Password";
import styles from "./Login.module.css";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`resetPage.passwordRule`, { min: PASSWORD_MIN_LENGTH }));
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword(token, password);
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t(`resetPage.error`));
        return;
      }
      setDone(true);
    } catch {
      setError(t(`resetPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  if (token === ``) {
    return (
      <div className={styles[`authPage`]}>
        <div className={styles[`authPanel`]}>
          <h1 className={styles[`title`]}>{t(`resetPage.invalidLink`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.invalidLinkLead`)}</p>
          <div className={styles[`actions`]}>
            <Link to="/forgot-password" className={styles[`link`]}>
              {t(`resetPage.requestAgain`)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles[`authPage`]}>
        <div className={styles[`authPanel`]}>
          <h1 className={styles[`title`]}>{t(`resetPage.done`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.doneLead`)}</p>
          <div className={styles[`actions`]}>
            <Link to="/login" className={styles[`link`]}>
              {t(`resetPage.loginLink`)}
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
          <h1 className={styles[`title`]}>{t(`resetPage.title`)}</h1>
          <PasswordInput
            id="reset-password"
            label={t(`resetPage.passwordLabel`, { min: PASSWORD_MIN_LENGTH })}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            disabled={loading}
          />
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading}>
              {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
