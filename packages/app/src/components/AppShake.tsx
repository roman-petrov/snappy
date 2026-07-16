import { useAppShakeState } from "./AppShake.state";
import { AppShakeView } from "./AppShake.view";

export const AppShake = () => <AppShakeView {...useAppShakeState()} />;
