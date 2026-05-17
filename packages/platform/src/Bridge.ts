/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Vibrate } from "./Vibrate";

const hapticFeedbackConstants: Record<Vibrate, number> = {
  clockTick: 4,
  confirm: 16,
  contextClick: 6,
  dragStart: 25,
  gestureEnd: 13,
  gestureStart: 12,
  gestureThresholdActivate: 23,
  gestureThresholdDeactivate: 24,
  keyboardRelease: 7,
  keyboardTap: 3,
  longPress: 0,
  noHaptics: -1,
  reject: 17,
  segmentFrequentTick: 27,
  segmentTick: 26,
  textHandleMove: 9,
  toggleOff: 22,
  toggleOn: 21,
  virtualKey: 1,
  virtualKeyRelease: 8,
};

type BarStyle = `dark` | `light`;

type NativeAndroidBridge = { hapticImpact: (constant: number) => void; setBarStyle: (theme: string) => void };

declare global {
  interface Window {
    AndroidBridge?: NativeAndroidBridge;
  }
}

const native = typeof window === `undefined` ? undefined : window.AndroidBridge;
const available = native !== undefined;
const hapticImpact = (constant: Vibrate) => native?.hapticImpact(hapticFeedbackConstants[constant]);
const setBarStyle = (style: BarStyle) => native?.setBarStyle(style);

export const Bridge = { available, hapticImpact, setBarStyle };
