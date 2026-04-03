import { useBalanceTapState } from "./BalanceTap.state";
import { BalanceTapView } from "./BalanceTap.view";

export const BalanceTap = () => <BalanceTapView {...useBalanceTapState()} />;
