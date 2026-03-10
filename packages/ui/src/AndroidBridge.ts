/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Theme } from "./core";

import { AndroidHapticFeedbackConstants } from "./AndroidHapticFeedbackConstants";

type NativeAndroidBridge = { hapticImpact: (constant: number) => void; setBarStyle: (theme: string) => void };

declare global {
  interface Window {
    AndroidBridge?: NativeAndroidBridge;
  }
}

const bridge = typeof window === `undefined` ? undefined : window.AndroidBridge;

const hapticImpact = (constant: AndroidHapticFeedbackConstants) =>
  bridge?.hapticImpact(AndroidHapticFeedbackConstants[constant]);

const setBarStyle = (theme: Theme) => bridge?.setBarStyle(theme);

export const AndroidBridge = { hapticImpact, setBarStyle };
