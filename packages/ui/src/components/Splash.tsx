import type { ReactNode } from "react";

import type { SplashPalette } from "./SplashPalette";

import { useSplashState } from "./Splash.state";
import { SplashView } from "./Splash.view";

export type SplashProps = {
  backgroundClassName?: string;
  canvasLayerClassName?: string;
  children: ReactNode;
  disabled?: boolean;
  palette: SplashPalette;
};

export const Splash = (props: SplashProps) => <SplashView {...useSplashState(props)} />;
