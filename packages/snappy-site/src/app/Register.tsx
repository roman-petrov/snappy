import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { setToken } from "./Auth";
import {
  generatePassword,
  passwordRequirements,
  passwordStrength,
  passwordValid,
  PASSWORD_MIN_LENGTH,
} from "./Password";
import styles from "./Login.module.css";

export const Register = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = passwordStrength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(`Пароль: не менее ${PASSWORD_MIN_LENGTH} символов, буквы и цифры`);
      return;
    }
    setLoading(true);
    try {
      const res = await api.register(email.trim(), password);
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Ошибка регистрации`);
        return;
      }
      if (data.token) {
        setToken(data.token);
        navigate(`/`, { replace: true });
      }
    } catch {
      setError(`Ошибка сети`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles[`authPage`]}>
      <div className={styles[`authPanel`]}>
        <form className={styles[`form`]} onSubmit={submit}>
          <h1 className={styles[`title`]}>Регистрация</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="reg-email">
              Email
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
              label="Пароль"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              disabled={loading}
            />
            <div className={styles[`requirements`]}>
              {passwordRequirements.map(({ label, check }) => (
                <span key={label} className={check(password) ? styles[`requirementMet`] : styles[`requirement`]}>
                  {check(password) ? "✓ " : ""}
                  {label}
                </span>
              ))}
            </div>
            <div className={styles[`strengthRow`]}>
              <span className={styles[`strengthLabel`]}>Надёжность:</span>
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
                {strength === "weak" ? "Слабый" : strength === "medium" ? "Средний" : "Надёжный"}
              </span>
            </div>
            <Button type="button" onClick={() => setPassword(generatePassword())} disabled={loading}>
              Сгенерировать пароль
            </Button>
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading || !passwordValid(password)}>
              {loading ? `Регистрация…` : `Зарегистрироваться`}
            </Button>
            <Link to="/login" className={styles[`link`]}>
              Уже есть аккаунт — войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
