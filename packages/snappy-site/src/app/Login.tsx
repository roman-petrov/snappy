import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { setToken } from "./Auth";
import styles from "./Login.module.css";

export const Login = () => {
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
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Ошибка входа`);
        return;
      }
      if (data.token) {
        setToken(data.token, remember);
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
          <h1 className={styles[`title`]}>Вход</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className={styles[`input`]}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <PasswordInput
            id="login-password"
            label="Пароль"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
            disabled={loading}
          />
          <div className={styles[`rememberRow`]}>
            <input
              id="login-remember"
              type="checkbox"
              className={styles[`checkbox`]}
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              disabled={loading}
            />
            <label className={styles[`rememberLabel`]} htmlFor="login-remember">
              Запомнить
            </label>
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading}>
              {loading ? `Вход…` : `Войти`}
            </Button>
            <Link to="/forgot-password" className={styles[`link`]}>
              Забыли пароль?
            </Link>
            <Link to="/register" className={styles[`link`]}>
              Регистрация
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
