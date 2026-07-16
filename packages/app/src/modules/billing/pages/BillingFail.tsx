import { useBillingFailState } from "./BillingFail.state";
import { BillingFailView } from "./BillingFail.view";

export const BillingFail = () => <BillingFailView {...useBillingFailState()} />;
