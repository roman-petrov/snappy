import { useEffect, useState } from "react";

import { api } from "./Api";
import { getToken } from "./Auth";
import styles from "./Dashboard.module.css";
import { featureKeys, featureLabels } from "./Features";

export const Dashboard = () => {
  const token = getToken() ?? ``;
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [text, setText] = useState(``);
  const [feature, setFeature] = useState(featureKeys[0] ?? ``);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.remaining(token).then(async res => {
      if (res.ok) {
        const data = (await res.json()) as { remaining?: number };
        setRemaining(data.remaining);
      }
    });
  }, [token]);

  const processText = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    try {
      const res = await api.process(token, text.trim(), feature);
      const data = (await res.json()) as { error?: string; text?: string };
      if (!res.ok) {
        setError(data.error ?? `Ошибка`);

        return;
      }
      setResult(data.text ?? ``);
      if (typeof data.text === `string` && remaining !== undefined) {
        setRemaining(remaining - 1);
      }
    } catch {
      setError(`Ошибка сети`);
    } finally {
      setLoading(false);
    }
  };

  const openPremium = async () => {
    try {
      const res = await api.premiumUrl(token);
      const data = (await res.json()) as { error?: string; url?: string };
      if (res.ok && data.url) {
        window.open(data.url, `_blank`);
      }
    } catch {
      //
    }
  };

  return (
    <>
      <section className={styles[`section`]}>
        <h2 className={styles[`title`]}>Баланс</h2>
        <div className={styles[`card`]}>
          <p className={styles[`balance`]}>Бесплатных запросов: {remaining ?? `—`}</p>
          <a
            className={styles[`premiumLink`]}
            href="#"
            onClick={e => {
              e.preventDefault();
              openPremium();
            }}
          >
            Оформить Premium
          </a>
        </div>
      </section>

      <section className={styles[`section`]}>
        <h2 className={styles[`title`]}>Обработка текста</h2>
        <form onSubmit={processText}>
          <div className={styles[`card`]}>
            <textarea
              className={styles[`textarea`]}
              disabled={loading}
              onChange={e => {
                setText(e.target.value);
              }}
              placeholder="Введите текст..."
              value={text}
            />
            <select
              className={styles[`select`]}
              disabled={loading}
              onChange={e => {
                setFeature(e.target.value);
              }}
              value={feature}
            >
              {featureKeys.map(k => (
                <option key={k} value={k}>
                  {featureLabels[k]}
                </option>
              ))}
            </select>
            <button className={styles[`btn`]} disabled={loading} type="submit">
              {loading ? `Обработка…` : `Обработать`}
            </button>
            {error !== `` && <p className={styles[`error`]}>{error}</p>}
            {result !== `` && <div className={styles[`result`]}>{result}</div>}
          </div>
        </form>
      </section>
    </>
  );
};
