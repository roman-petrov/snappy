import { i } from "@snappy/intl";
import { Button, FilledIcon, Spinner, StatusPage } from "@snappy/ui";
import { Check } from "lucide-react";

import type { useBillingSuccessState } from "./BillingSuccess.state";

import { t } from "../../../core";
import { BillingResultSupport } from "../components";

export type BillingSuccessViewProps = ReturnType<typeof useBillingSuccessState>;

export const BillingSuccessView = ({ amount, home, leftSec, screen, start }: BillingSuccessViewProps) =>
  screen === `loading` ? (
    <StatusPage
      back
      center
      icon={<Spinner size="xxxl" time={leftSec > 0 ? `${leftSec}` : undefined} />}
      title={t(`billing.result.loading`)}
    />
  ) : screen === `succeeded` ? (
    <StatusPage
      celebrate
      icon={<FilledIcon color="success" icon={Check} size="xxxl" />}
      lead={
        amount === undefined
          ? t(`billing.result.succeeded.lead`)
          : t(`billing.result.succeeded.leadAmount`, { amount: i.price(amount) })
      }
      title={t(`billing.result.succeeded.title`)}
    >
      <Button onClick={home} text={t(`billing.result.succeeded.home`)} type="primary" />
    </StatusPage>
  ) : (
    <BillingResultSupport kind={screen} start={start} />
  );
