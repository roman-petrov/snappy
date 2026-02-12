import { useEffect, useState } from "react";

import { Button } from "../shared/Button";
import { api } from "./Api";
import { getToken } from "./Auth";
import styles from "./Dashboard.module.css";
import { featureEmoji, featureKeys, featureLabels } from "./Features";

export const Dashboard = () => {
  const token = getToken() ?? ``;
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [text, setText] = useState(``);
  const [feature, setFeature] = useState(featureKeys[0] ?? ``);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setCopied(false);
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
      <h1 className={styles[`pageTitle`]}>Личный кабинет</h1>

      <section className={styles[`section`]}>
        <h2 className={styles[`sectionTitle`]}>Баланс</h2>
        <div className={styles[`card`]}>
          <div className={styles[`balanceRow`]}>
            <p className={styles[`balance`]}>
              <span className={styles[`balanceIcon`]} aria-hidden>
                🪙
              </span>
              Бесплатных запросов: <span className={styles[`balanceCount`]}>{remaining ?? `—`}</span>
            </p>
            <Button
              primary
              onClick={() => {
                openPremium();
              }}
            >
              Оформить Premium
            </Button>
          </div>
        </div>
      </section>

      <section className={styles[`section`]}>
        <h2 className={styles[`sectionTitle`]}>Обработка текста</h2>
        <p className={styles[`sectionDesc`]}>
          Выберите действие и введите текст — результат можно скопировать одним нажатием.
        </p>
        <form onSubmit={processText}>
          <div className={styles[`card`]}>
            <div className={styles[`formGroup`]}>
              <label className={styles[`label`]} htmlFor="dashboard-text">
                Текст
              </label>
              <textarea
                id="dashboard-text"
                className={styles[`textarea`]}
                disabled={loading}
                onChange={e => {
                  setText(e.target.value);
                }}
                placeholder="Введите текст для обработки..."
                value={text}
              />
            </div>
            <div className={styles[`formGroup`]}>
              <label className={styles[`label`]} htmlFor="dashboard-feature">
                Действие
              </label>
              <select
                id="dashboard-feature"
                className={styles[`select`]}
                disabled={loading}
                onChange={e => {
                  setFeature(e.target.value);
                }}
                value={feature}
              >
                {featureKeys.map(k => (
                  <option key={k} value={k}>
                    {featureEmoji[k]} {featureLabels[k]}
                  </option>
                ))}
              </select>
            </div>
            <Button className={styles[`submitRow`]} disabled={loading} primary type="submit">
              {loading ? `Обработка…` : `Обработать`}
            </Button>
            {error !== `` && <p className={styles[`error`]}>{error}</p>}
            {result !== `` && (
              <div className={styles[`resultWrap`]}>
                <div className={styles[`resultHeader`]}>
                  <span className={styles[`resultLabel`]}>Результат</span>
                  <button
                    type="button"
                    className={styles[`copyBtn`]}
                    onClick={() => {
                      void navigator.clipboard.writeText(result).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      });
                    }}
                  >
                    {copied ? `Скопировано ✓` : `Копировать`}
                  </button>
                </div>
                <div className={styles[`result`]}>{result}</div>
              </div>
            )}
          </div>
        </form>
      </section>
    </>
  );
};
