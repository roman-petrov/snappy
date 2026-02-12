import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { api } from "./Api";
import { setToken } from "./Auth";
import styles from "./Login.module.css";

export const Login = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
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
      <div className={styles[`field`]}>
        <label className={styles[`label`]} htmlFor="login-password">
          Пароль
        </label>
        <input
          id="login-password"
          type="password"
          className={styles[`input`]}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
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
  );
};
