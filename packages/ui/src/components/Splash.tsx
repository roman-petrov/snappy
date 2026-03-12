import { useSplashState } from "./Splash.state";
import { SplashView } from "./Splash.view";

export type SplashProps = { color: number; x: number; y: number };

export const Splash = (props: SplashProps) => <SplashView {...useSplashState(props)} />;
