import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../shared/Button";
import { api } from "./Api";
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
        setError(data.error ?? `Ошибка`);
        return;
      }
      setSent(true);
    } catch {
      setError(`Ошибка сети`);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles[`authPage`]}>
        <div className={styles[`authPanel`]}>
          <h1 className={styles[`title`]}>Проверьте почту</h1>
          <p className={styles[`authLead`]}>Если аккаунт с таким email есть, мы отправили ссылку для сброса пароля.</p>
          <div className={styles[`actions`]}>
            <Link to="/login" className={styles[`link`]}>
              Вернуться ко входу
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
          <h1 className={styles[`title`]}>Забыли пароль</h1>
          <p className={styles[`authLead`]}>Введите email — мы отправим ссылку для сброса пароля.</p>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              className={styles[`input`]}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button type="submit" primary disabled={loading}>
              {loading ? `Отправка…` : `Отправить`}
            </Button>
            <Link to="/login" className={styles[`link`]}>
              Вход
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
