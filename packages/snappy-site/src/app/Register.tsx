import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { api } from "./Api";
import { setToken } from "./Auth";
import styles from "./Login.module.css";

export const Register = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    if (password.length < 6) {
      setError(`Пароль не менее 6 символов`);
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
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="reg-password">
              Пароль (не менее 6 символов)
            </label>
            <input
              id="reg-password"
              type="password"
              className={styles[`input`]}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading}>
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
