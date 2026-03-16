import { i } from "@snappy/intl";
import { Card } from "@snappy/ui";

import type { useLimitState } from "./Limit.state";

import { Page, SubscribeButton } from "./components";
import { t } from "./core";
import styles from "./Limit.module.scss";

export type LimitViewProps = ReturnType<typeof useLimitState>;

export const LimitView = ({
  countdown,
  freeRequestLimit,
  loading,
  payError,
  payLoading,
  premiumPrice,
  subscribe,
}: LimitViewProps) => {
  const limitI18n = { freeRequestLimit: i.number(freeRequestLimit), premiumPrice: i.price(premiumPrice) };

  return (
    <Page title={t(`limit.title`)}>
      <p className={styles.lead}>{t(`limit.lead`, limitI18n)}</p>
      {loading ? (
        <p className={styles.reset}>{t(`limit.resetLabel`)}: …</p>
      ) : (
        <p aria-live="polite" className={styles.reset}>
          {t(`limit.resetLabel`)}: <strong>{countdown}</strong>
        </p>
      )}
      <Card cn={styles.premium}>
        <h2 className={styles.premiumTitle}>{t(`limit.premiumTitle`)}</h2>
        <p className={styles.premiumLead}>{t(`limit.premiumLead`, limitI18n)}</p>
        <SubscribeButton loading={payLoading} onClick={subscribe} premiumPrice={premiumPrice} />
        {payError !== `` && <p className={styles.payError}>{payError}</p>}
      </Card>
    </Page>
  );
};
