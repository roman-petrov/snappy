/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { $, Alert, Block, Button, Card, Select, Text, Textarea, Title } from "@snappy/ui";

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
    <Title cn={styles.pageTitle} level={2} title={t(`dashboard.title`)} />

    <section className={styles.section}>
      <Title as="h2" level={2} title={t(`dashboard.balance`)} />
      <Card>
        <div className={styles.balanceRow}>
          <p className={`${$.typography(`bodyLg`)} ${$.color(`body`)}`}>
            <span aria-hidden className={styles.balanceIcon}>
              🪙
            </span>
            {` ${t(`dashboard.freeRequests`)}: `}
            <Text as="span" color="accent" text={remaining === undefined ? `—` : String(remaining)} typography="h2" />
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
          {error !== `` && <Alert text={error} variant="error" />}
          {result !== `` && (
            <div className={styles.resultWrap}>
              <div className={styles.resultHeader}>
                <Text as="span" color="heading" text={t(`dashboard.result`)} typography="captionBold" />
                <button className={styles.copyBtn} onClick={onCopyResult} type="button">
                  <Text
                    as="span"
                    color="accent"
                    text={copied ? t(`dashboard.copied`) : t(`dashboard.copy`)}
                    typography="caption"
                  />
                </button>
              </div>
              <Text as="div" cn={styles.result} text={result} typography="largeBody" />
            </div>
          )}
        </Card>
      </form>
    </section>
  </>
);
