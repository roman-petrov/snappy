import { useTopUpState } from "./TopUp.state";
import { TopUpView } from "./TopUp.view";

export const TopUp = () => <TopUpView {...useTopUpState()} />;
