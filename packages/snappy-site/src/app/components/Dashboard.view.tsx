/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Block, Button, Card, Error, Select, Textarea, Title } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { type FeatureType, t } from "../core";
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
    <Title cn={styles.pageTitle} level={2}>
      {t(`dashboard.title`)}
    </Title>

    <section className={styles.section}>
      <Title as="h2" level={2}>
        {t(`dashboard.balance`)}
      </Title>
      <Card>
        <div className={styles.balanceRow}>
          <p className={styles.balance}>
            <span aria-hidden className={styles.balanceIcon}>
              🪙
            </span>
            {t(`dashboard.freeRequests`)}: <span className={styles.balanceCount}>{remaining ?? `—`}</span>
          </p>
          <Button onClick={onPremiumClick} primary>
            {t(`dashboard.getPremium`)}
          </Button>
        </div>
      </Card>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionIntro}>
        <Block description={t(`dashboard.processDesc`)} title={t(`dashboard.process`)} titleTag="h2" />
      </div>
      <form onSubmit={onSubmit}>
        <Card>
          <div className={styles.formGroup}>
            <Textarea
              disabled={loading}
              id="dashboard-text"
              label={t(`dashboard.text`)}
              onChange={onTextChange}
              placeholder={t(`dashboard.textPlaceholder`)}
              value={text}
            />
          </div>
          <div className={styles.formGroup}>
            <Select
              disabled={loading}
              id="dashboard-feature"
              label={t(`dashboard.action`)}
              onChange={v => onFeatureChange(v as FeatureType)}
              options={featureKeys.map(key => ({ label: `${featureEmoji[key]} ${t(`features.${key}`)}`, value: key }))}
              value={feature}
            />
          </div>
          <Button cn={styles.submitRow} disabled={loading} primary type="submit">
            {loading ? t(`dashboard.submitting`) : t(`dashboard.submit`)}
          </Button>
          {error !== `` && <Error>{error}</Error>}
          {result !== `` && (
            <div className={styles.resultWrap}>
              <div className={styles.resultHeader}>
                <span className={styles.resultLabel}>{t(`dashboard.result`)}</span>
                <button className={styles.copyBtn} onClick={onCopyResult} type="button">
                  {copied ? t(`dashboard.copied`) : t(`dashboard.copy`)}
                </button>
              </div>
              <div className={styles.result}>{result}</div>
            </div>
          )}
        </Card>
      </form>
    </section>
  </>
);
