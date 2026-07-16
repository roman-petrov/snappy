import { useBillingSuccessState } from "./BillingSuccess.state";
import { BillingSuccessView } from "./BillingSuccess.view";

export const BillingSuccess = () => <BillingSuccessView {...useBillingSuccessState()} />;
