import { useBillingResultSupportState } from "./BillingResultSupport.state";
import { BillingResultSupportView } from "./BillingResultSupport.view";

export type BillingResultSupportProps = { kind: `canceled` | `failed` | `timeout`; start?: () => void };

export const BillingResultSupport = (props: BillingResultSupportProps) => (
  <BillingResultSupportView {...useBillingResultSupportState(props)} />
);
