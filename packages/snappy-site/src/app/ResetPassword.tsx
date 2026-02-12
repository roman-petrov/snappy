import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../shared/Button";
import { PasswordInput } from "../shared/PasswordInput";
import { api } from "./Api";
import { passwordValid, PASSWORD_MIN_LENGTH } from "./Password";
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
    if (!passwordValid(password)) {
      setError(`Пароль: не менее ${PASSWORD_MIN_LENGTH} символов, буквы и цифры`);
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
          <PasswordInput
            id="reset-password"
            label={`Пароль (не менее ${PASSWORD_MIN_LENGTH} символов, буквы и цифры)`}
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            disabled={loading}
          />
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
