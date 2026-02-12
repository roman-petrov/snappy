import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { PasswordInput } from "../../shared/PasswordInput";
import { api } from "../core/Api";
import { t } from "../core/Locale";
import { passwordMinLength, passwordValid } from "../core/Password";
import { Card } from "./Card";
import styles from "./Login.module.css";

export const ResetPassword = () => {
  const [searchParameters] = useSearchParams();
  const token = searchParameters.get(`token`) ?? ``;
  const [password, setPassword] = useState(``);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`resetPage.passwordRule`, { min: passwordMinLength }));

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
        <Card className={styles[`authPanel`]} glass narrow>
          <h1 className={styles[`title`]}>{t(`resetPage.invalidLink`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.invalidLinkLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/forgot-password">{t(`resetPage.requestAgain`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles[`authPage`]}>
        <Card className={styles[`authPanel`]} glass narrow>
          <h1 className={styles[`title`]}>{t(`resetPage.done`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.doneLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/login">{t(`resetPage.loginLink`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles[`authPage`]}>
      <Card className={styles[`authPanel`]} glass narrow>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(`resetPage.title`)}</h1>
          <PasswordInput
            autoComplete="new-password"
            disabled={loading}
            id="reset-password"
            label={t(`resetPage.passwordLabel`, { min: passwordMinLength })}
            minLength={passwordMinLength}
            onChange={setPassword}
            required
            value={password}
          />
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading} primary type="submit">
              {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
