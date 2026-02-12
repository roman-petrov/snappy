import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { PasswordInput } from "../../shared/PasswordInput";
import { api } from "../core/Api";
import { setToken } from "../core/Auth";
import { t } from "../core/Locale";
import {
  generatePassword,
  PASSWORD_MIN_LENGTH,
  passwordRequirementChecks,
  passwordStrength,
  passwordValid,
} from "../core/Password";
import { Card } from "./Card";
import styles from "./Login.module.css";

export const Register = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = passwordStrength(password);

  const requirements = [
    {
      check: passwordRequirementChecks[0]!.check,
      label: t(`registerPage.requirementMin`, { min: PASSWORD_MIN_LENGTH }),
    },
    { check: passwordRequirementChecks[1]!.check, label: t(`registerPage.requirementLetters`) },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`registerPage.passwordRule`, { min: PASSWORD_MIN_LENGTH }));

      return;
    }
    setLoading(true);
    try {
      const res = await api.register(email.trim(), password);
      const data = (await res.json()) as { error?: string; token?: string };
      if (!res.ok) {
        setError(data.error ?? t(`registerPage.errorRegister`));

        return;
      }
      if (data.token) {
        setToken(data.token);
        navigate(`/`, { replace: true, viewTransition: true });
      }
    } catch {
      setError(t(`registerPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles[`authPage`]}>
      <Card className={styles[`authPanel`]} glass narrow>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>{t(`registerPage.title`)}</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="reg-email">
              {t(`registerPage.email`)}
            </label>
            <input
              autoComplete="email"
              className={styles[`input`]}
              id="reg-email"
              onChange={e => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              value={email}
            />
          </div>
          <div className={styles[`passwordBlock`]}>
            <PasswordInput
              autoComplete="new-password"
              disabled={loading}
              id="reg-password"
              label={t(`registerPage.password`)}
              minLength={PASSWORD_MIN_LENGTH}
              onChange={setPassword}
              required
              value={password}
            />
            <div className={styles[`requirements`]}>
              {requirements.map(({ check, label }) => (
                <span className={check(password) ? styles[`requirementMet`] : styles[`requirement`]} key={label}>
                  {check(password) ? `✓ ` : ``}
                  {label}
                </span>
              ))}
            </div>
            <div className={styles[`strengthRow`]}>
              <span className={styles[`strengthLabel`]}>{t(`registerPage.strength`)}:</span>
              <div className={styles[`strengthBar`]}>
                <div
                  className={styles[`strengthFill`]}
                  data-strength={strength}
                  style={{
                    width:
                      password.length === 0
                        ? `0%`
                        : strength === `weak`
                          ? `33%`
                          : strength === `medium`
                            ? `66%`
                            : `100%`,
                  }}
                />
              </div>
              <span className={styles[`strengthText`]}>
                {strength === `weak`
                  ? t(`registerPage.strengthWeak`)
                  : strength === `medium`
                    ? t(`registerPage.strengthMedium`)
                    : t(`registerPage.strengthStrong`)}
              </span>
            </div>
            <Button
              disabled={loading}
              onClick={() => {
                setPassword(generatePassword());
              }}
              type="button"
            >
              {t(`registerPage.generatePassword`)}
            </Button>
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading || !passwordValid(password)} primary type="submit">
              {loading ? t(`registerPage.submitting`) : t(`registerPage.submit`)}
            </Button>
            <AccentLink to="/login">{t(`registerPage.haveAccount`)}</AccentLink>
          </div>
        </form>
      </Card>
    </div>
  );
};
