import { useBillingTopUpState } from "./BillingTopUp.state";
import { BillingTopUpView } from "./BillingTopUp.view";

export const BillingTopUp = () => <BillingTopUpView {...useBillingTopUpState()} />;
