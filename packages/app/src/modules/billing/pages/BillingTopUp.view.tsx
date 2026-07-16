import { _ } from "@snappy/core";
import { i } from "@snappy/intl";
import {
  Button,
  CircleEmoji,
  ErrorAlert,
  InfoAlert,
  NumberInput,
  Page,
  PageNarrow,
  Spinner,
  StatusPage,
  Tabs,
  Text,
} from "@snappy/ui";
import { Wallet } from "lucide-react";

import type { useBillingTopUpState } from "./BillingTopUp.state";

import { AppTags } from "../../../AppTags";
import { t } from "../../../core";
import styles from "./BillingTopUp.module.scss";

export type BillingTopUpViewProps = ReturnType<typeof useBillingTopUpState>;

export const BillingTopUpView = ({
  amount,
  balance,
  error,
  loading,
  max,
  min,
  mode,
  pay,
  redirecting,
  setAmount,
  setMode,
}: BillingTopUpViewProps) =>
  redirecting ? (
    <StatusPage back center icon={<Spinner size="xxxl" />} title={t(`billing.topUp.submitting`)} />
  ) : (
    <Page back fill title={t(`billing.topUp.title`)}>
      <PageNarrow>
        <div className={styles.content}>
          <div className={styles.hero}>
            <CircleEmoji emoji="💳" size="xxxl" />
            {balance === undefined ? undefined : (
              <div className={styles.balance}>
                <Text text={i.price(balance)} typography="display" />
                <Text text={t(`billing.topUp.balance`)} typography="caption" />
              </div>
            )}
          </div>
          <div className={styles.modes}>
            <Tabs
              disabled={loading}
              onChange={setMode}
              options={[
                {
                  label: `⚡ ${t(`billing.topUp.mode.presets`)}`,
                  title: t(`billing.topUp.mode.presets`),
                  value: `presets`,
                },
                {
                  label: `⚙️ ${t(`billing.topUp.mode.custom`)}`,
                  title: t(`billing.topUp.mode.custom`),
                  value: `custom`,
                },
              ]}
              stretch
              value={mode}
            />
            <div className={styles.viewport}>
              <div className={_.cn(styles.track, mode === `custom` && styles.trackCustom)}>
                <div className={styles.page}>
                  <InfoAlert text={t(`billing.topUp.presetsLead`)} />
                  {(
                    [
                      { amount: 100, emoji: `💵` },
                      { amount: 300, emoji: `💰` },
                      { amount: 500, emoji: `💎` },
                      { amount: 1000, emoji: `🚀` },
                    ] as const
                  ).map(preset => (
                    <Button
                      disabled={loading}
                      icon={preset.emoji}
                      key={preset.amount}
                      onClick={() => pay(preset.amount)}
                      text={`+${i.price(preset.amount, `whole`)}`}
                    />
                  ))}
                </div>
                <div className={styles.page}>
                  <NumberInput
                    disabled={loading}
                    label={t(`billing.topUp.limits`, {
                      max: max === undefined ? `…` : i.price(max, `whole`),
                      min: min === undefined ? `…` : i.price(min, `whole`),
                    })}
                    onChange={setAmount}
                    value={amount}
                  />
                  {error === undefined ? undefined : <ErrorAlert text={t(`billing.topUp.errors.${error}`)} />}
                  <Button
                    disabled={loading}
                    icon={Wallet}
                    onClick={() => pay(amount)}
                    tag={AppTags.billing.topUp.submit}
                    text={t(`billing.topUp.submit`)}
                    type="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageNarrow>
    </Page>
  );
