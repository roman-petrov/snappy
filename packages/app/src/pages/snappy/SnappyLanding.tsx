import { useSnappyLandingState } from "./SnappyLanding.state";
import { SnappyLandingView } from "./SnappyLanding.view";

export const SnappyLanding = () => <SnappyLandingView {...useSnappyLandingState()} />;
