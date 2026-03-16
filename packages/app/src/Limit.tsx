import { useLimitState } from "./Limit.state";
import { LimitView } from "./Limit.view";

export const Limit = () => <LimitView {...useLimitState()} />;
