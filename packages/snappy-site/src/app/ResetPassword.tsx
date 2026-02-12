import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../shared/Button";
import { api } from "./Api";
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
    if (password.length < 6) {
      setError(`Пароль не менее 6 символов`);
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetPassword(token, password);
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? `Ошибка`);
        return;
      }
      setDone(true);
    } catch {
      setError(`Ошибка сети`);
    } finally {
      setLoading(false);
    }
  };

  if (token === ``) {
    return (
      <div className={styles[`authPage`]}>
        <div className={styles[`authPanel`]}>
          <h1 className={styles[`title`]}>Неверная ссылка</h1>
          <p className={styles[`authLead`]}>Используйте ссылку из письма для сброса пароля.</p>
          <div className={styles[`actions`]}>
            <Link to="/forgot-password" className={styles[`link`]}>
              Запросить снова
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
          <h1 className={styles[`title`]}>Пароль изменён</h1>
          <p className={styles[`authLead`]}>Теперь можно войти с новым паролем.</p>
          <div className={styles[`actions`]}>
            <Link to="/login" className={styles[`link`]}>
              Войти
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
          <h1 className={styles[`title`]}>Новый пароль</h1>
          <div className={styles[`field`]}>
            <label className={styles[`label`]} htmlFor="reset-password">
              Пароль (не менее 6 символов)
            </label>
            <input
              id="reset-password"
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
              {loading ? `Сохранение…` : `Сохранить`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
