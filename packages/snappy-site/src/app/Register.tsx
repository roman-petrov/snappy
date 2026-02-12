import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { useLocale } from "../shared/LocaleContext";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { setToken } from "./Auth";
import { t } from "./Locale";
import {
  generatePassword,
  passwordRequirementChecks,
  passwordStrength,
  passwordValid,
  PASSWORD_MIN_LENGTH,
} from "./Password";
import styles from "./Login.module.css";

export const Register = () => {
  const { locale } = useLocale();
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = passwordStrength(password);
  const requirements = [
    {
      label: t(locale, `registerPage.requirementMin`, { min: PASSWORD_MIN_LENGTH }),
      check: passwordRequirementChecks[0]!.check,
    },
    { label: t(locale, `registerPage.requirementLetters`), check: passwordRequirementChecks[1]!.check },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(locale, `registerPage.passwordRule`, { min: PASSWORD_MIN_LENGTH }));
      return;
    }
    setLoading(true);
    try {
      const res = await api.register(email.trim(), password);
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? t(locale, `registerPage.errorRegister`));
        return;
      }
      if (data.token) {
        setToken(data.token);
        navigate(`/`, { replace: true });
      }
    } catch {
      setError(t(locale, `registerPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles[`authPage`]}>
      <div className={styles[`authPanel`]}>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(locale, `registerPage.title`)}</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="reg-email">
              {t(locale, `registerPage.email`)}
            </label>
            <input
              id="reg-email"
              type="email"
              className={styles[`input`]}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles[`passwordBlock`]}>
            <PasswordInput
              id="reg-password"
              label={t(locale, `registerPage.password`)}
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              disabled={loading}
            />
            <div className={styles[`requirements`]}>
              {requirements.map(({ label, check }) => (
                <span key={label} className={check(password) ? styles[`requirementMet`] : styles[`requirement`]}>
                  {check(password) ? "✓ " : ""}
                  {label}
                </span>
              ))}
            </div>
            <div className={styles[`strengthRow`]}>
              <span className={styles[`strengthLabel`]}>{t(locale, `registerPage.strength`)}:</span>
              <div className={styles[`strengthBar`]}>
                <div
                  className={styles[`strengthFill`]}
                  data-strength={strength}
                  style={{
                    width:
                      password.length === 0
                        ? "0%"
                        : strength === "weak"
                          ? "33%"
                          : strength === "medium"
                            ? "66%"
                            : "100%",
                  }}
                />
              </div>
              <span className={styles[`strengthText`]}>
                {strength === "weak"
                  ? t(locale, `registerPage.strengthWeak`)
                  : strength === "medium"
                    ? t(locale, `registerPage.strengthMedium`)
                    : t(locale, `registerPage.strengthStrong`)}
              </span>
            </div>
            <Button type="button" onClick={() => setPassword(generatePassword())} disabled={loading}>
              {t(locale, `registerPage.generatePassword`)}
            </Button>
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading || !passwordValid(password)}>
              {loading ? t(locale, `registerPage.submitting`) : t(locale, `registerPage.submit`)}
            </Button>
            <Link to="/login" className={styles[`link`]}>
              {t(locale, `registerPage.haveAccount`)}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
