import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { useLocale } from "../shared/LocaleContext";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { setToken } from "./Auth";
import { t } from "./Locale";
import styles from "./Login.module.css";

export const Login = () => {
  const { locale } = useLocale();
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      const data = (await res.json()) as { error?: string; token?: string };
      if (!res.ok) {
        setError(data.error ?? t(locale, `loginPage.errorLogin`));

        return;
      }
      if (data.token) {
        setToken(data.token, remember);
        navigate(`/`, { replace: true });
      }
    } catch {
      setError(t(locale, `loginPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles[`authPage`]}>
      <div className={styles[`authPanel`]}>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(locale, `loginPage.title`)}</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="login-email">
              {t(locale, `loginPage.email`)}
            </label>
            <input
              autoComplete="email"
              className={styles[`input`]}
              id="login-email"
              onChange={e => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              value={email}
            />
          </div>
          <PasswordInput
            autoComplete="current-password"
            disabled={loading}
            id="login-password"
            label={t(locale, `loginPage.password`)}
            onChange={setPassword}
            required
            value={password}
          />
          <div className={styles[`rememberRow`]}>
            <input
              checked={remember}
              className={styles[`checkbox`]}
              disabled={loading}
              id="login-remember"
              onChange={e => {
                setRemember(e.target.checked);
              }}
              type="checkbox"
            />
            <label className={styles[`rememberLabel`]} htmlFor="login-remember">
              {t(locale, `loginPage.remember`)}
            </label>
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading} primary type="submit">
              {loading ? t(locale, `loginPage.submitting`) : t(locale, `loginPage.submit`)}
            </Button>
            <Link className={styles[`link`]} to="/forgot-password">
              {t(locale, `loginPage.forgotPassword`)}
            </Link>
            <Link className={styles[`link`]} to="/register">
              {t(locale, `loginPage.registerLink`)}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
