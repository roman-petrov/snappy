import type { useDashboardState } from "./Dashboard.state";

import { Button, Card } from "@snappy/ui";
import { t } from "../core/Locale";
import styles from "./Dashboard.module.css";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  copied,
  error,
  feature,
  featureEmoji,
  featureKeys,
  loading,
  onCopyResult,
  onFeatureChange,
  onPremiumClick,
  onSubmit,
  onTextChange,
  remaining,
  result,
  text,
}: DashboardViewProps) => (
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
          <Button onClick={onPremiumClick} primary>
            {t(`dashboard.getPremium`)}
          </Button>
        </div>
      </Card>
    </section>

    <section className={styles[`section`]}>
      <h2 className={styles[`sectionTitle`]}>{t(`dashboard.process`)}</h2>
      <p className={styles[`sectionDesc`]}>{t(`dashboard.processDesc`)}</p>
      <form onSubmit={onSubmit}>
        <Card>
          <div className={styles[`formGroup`]}>
            <label className={styles[`label`]} htmlFor="dashboard-text">
              {t(`dashboard.text`)}
            </label>
            <textarea
              className={styles[`textarea`]}
              disabled={loading}
              id="dashboard-text"
              onChange={event => {
                onTextChange(event.target.value);
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
              onChange={event => {
                onFeatureChange(event.target.value);
              }}
              value={feature}
            >
              {featureKeys.map(key => (
                <option key={key} value={key}>
                  {featureEmoji[key]} {t(`features.${key}`)}
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
                <button className={styles[`copyBtn`]} onClick={onCopyResult} type="button">
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
