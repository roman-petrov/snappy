import { useEffect, useState } from "react";

import { Button } from "../../shared/Button";
import { api } from "../core/Api";
import { getToken } from "../core/Auth";
import { Card } from "./Card";
import styles from "./Dashboard.module.css";
import { featureEmoji, featureKeys } from "../core/Features";
import { t } from "../core/Locale";

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
        setError(data.error ?? t(`dashboard.error`));

        return;
      }
      setResult(data.text ?? ``);
      setCopied(false);
      if (typeof data.text === `string` && remaining !== undefined) {
        setRemaining(remaining - 1);
      }
    } catch {
      setError(t(`dashboard.errorNetwork`));
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
      <h1 className={styles[`pageTitle`]}>{t(`dashboard.title`)}</h1>

      <section className={styles[`section`]}>
        <h2 className={styles[`sectionTitle`]}>{t(`dashboard.balance`)}</h2>
        <Card>
          <div className={styles[`balanceRow`]}>
            <p className={styles[`balance`]}>
              <span aria-hidden className={styles[`balanceIcon`]}>
                🪙
              </span>
              {t(`dashboard.freeRequests`)}: <span className={styles[`balanceCount`]}>{remaining ?? `—`}</span>
            </p>
            <Button onClick={async () => openPremium()} primary>
              {t(`dashboard.getPremium`)}
            </Button>
          </div>
        </Card>
      </section>

      <section className={styles[`section`]}>
        <h2 className={styles[`sectionTitle`]}>{t(`dashboard.process`)}</h2>
        <p className={styles[`sectionDesc`]}>{t(`dashboard.processDesc`)}</p>
        <form onSubmit={processText}>
          <Card>
            <div className={styles[`formGroup`]}>
              <label className={styles[`label`]} htmlFor="dashboard-text">
                {t(`dashboard.text`)}
              </label>
              <textarea
                className={styles[`textarea`]}
                disabled={loading}
                id="dashboard-text"
                onChange={e => {
                  setText(e.target.value);
                }}
                placeholder={t(`dashboard.textPlaceholder`)}
                value={text}
              />
            </div>
            <div className={styles[`formGroup`]}>
              <label className={styles[`label`]} htmlFor="dashboard-feature">
                {t(`dashboard.action`)}
              </label>
              <select
                className={styles[`select`]}
                disabled={loading}
                id="dashboard-feature"
                onChange={e => {
                  setFeature(e.target.value);
                }}
                value={feature}
              >
                {featureKeys.map(k => (
                  <option key={k} value={k}>
                    {featureEmoji[k]} {t(`features.${k}`)}
                  </option>
                ))}
              </select>
            </div>
            <Button className={styles[`submitRow`]} disabled={loading} primary type="submit">
              {loading ? t(`dashboard.submitting`) : t(`dashboard.submit`)}
            </Button>
            {error !== `` && <p className={styles[`error`]}>{error}</p>}
            {result !== `` && (
              <div className={styles[`resultWrap`]}>
                <div className={styles[`resultHeader`]}>
                  <span className={styles[`resultLabel`]}>{t(`dashboard.result`)}</span>
                  <button
                    className={styles[`copyBtn`]}
                    onClick={() => {
                      void navigator.clipboard.writeText(result).then(() => {
                        setCopied(true);
                        setTimeout(() => {
                          setCopied(false);
                        }, 2000);
                      });
                    }}
                    type="button"
                  >
                    {copied ? t(`dashboard.copied`) : t(`dashboard.copy`)}
                  </button>
                </div>
                <div className={styles[`result`]}>{result}</div>
              </div>
            )}
          </Card>
        </form>
      </section>
    </>
  );
};
