import { i } from "@snappy/intl";
import { Alert, Button, Switch } from "@snappy/ui";

import type { useSettingsSubscriptionState } from "./SettingsSubscription.state";

import { Page, SubscribeButton } from "../../components";
import { t } from "../../core";
import { SettingsCard } from "./components";
import styles from "./SettingsSubscription.view.module.scss";

export type SettingsSubscriptionViewProps = ReturnType<typeof useSettingsSubscriptionState>;

export const SettingsSubscriptionView = ({
  daysLeft,
  deleteLoading,
  deleteSubscription,
  error,
  freeRequestLimit,
  premiumPrice,
  renew,
  renewLoading,
  setAutoRenew,
  status,
  subscribe,
  subscribeLoading,
  toggleLoading,
}: SettingsSubscriptionViewProps) => (
  <Page back title={t(`settings.subscription`)}>
    <SettingsCard
      error={error === `` ? `` : t(error)}
      lead={
        status.kind === `free`
          ? t(`settingsSubscription.freeLead`, { freeRequestLimit: i.number(freeRequestLimit) })
          : t(`settingsSubscription.premiumLead`, {
              daysLeft: i.number(daysLeft),
              premiumUntil: i.date(status.premiumUntil),
            })
      }
      title={status.kind === `free` ? t(`settingsSubscription.freeTitle`) : t(`settingsSubscription.premiumTitle`)}
    >
      {status.kind === `free` ? (
        <SubscribeButton loading={subscribeLoading} onClick={subscribe} premiumPrice={premiumPrice} />
      ) : (
        <div className={styles.actions}>
          <div className={styles.row}>
            <p className={styles.label}>
              {status.autoRenew
                ? t(`settingsSubscription.autoRenewOn`, { nextBilling: i.date(status.nextBillingAt) })
                : t(`settingsSubscription.autoRenewOff`)}
            </p>
            <Switch
              checked={status.autoRenew}
              disabled={toggleLoading}
              label={t(`settingsSubscription.autoRenewLabel`)}
              onChange={setAutoRenew}
            />
          </div>
          {!status.autoRenew && (
            <SubscribeButton
              disabled={deleteLoading}
              loading={renewLoading}
              onClick={renew}
              premiumPrice={premiumPrice}
              text={t(`settingsSubscription.renew`)}
            />
          )}
          <Alert text={t(`settingsSubscription.deleteWarning`)} variant="error" />
          <Button
            disabled={deleteLoading}
            icon={{ emoji: `🗑️` }}
            onClick={deleteSubscription}
            text={t(`settingsSubscription.delete`)}
          />
        </div>
      )}
    </SettingsCard>
  </Page>
);
