import { _ } from "@snappy/core";

import type { useBillingFailState } from "./BillingFail.state";

import { BillingResultSupport } from "../components";

export type BillingFailViewProps = ReturnType<typeof useBillingFailState>;

export const BillingFailView = ({ screen }: BillingFailViewProps) =>
  screen === `canceled` ? (
    <BillingResultSupport kind="canceled" />
  ) : (
    <BillingResultSupport kind="failed" start={_.noop} />
  );
