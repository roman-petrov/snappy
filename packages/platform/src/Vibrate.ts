/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable functional/no-expression-statements */
import { Bridge } from "./Bridge";

/**
 * @see https://developer.android.com/reference/android/view/HapticFeedbackConstants
 */
const types = [
  `none`,
  `clockTick`,
  `confirm`,
  `contextClick`,
  `dragStart`,
  `gestureEnd`,
  `gestureStart`,
  `gestureThresholdActivate`,
  `gestureThresholdDeactivate`,
  `keyboardRelease`,
  `keyboardTap`,
  `longPress`,
  `noHaptics`,
  `reject`,
  `segmentFrequentTick`,
  `segmentTick`,
  `textHandleMove`,
  `toggleOff`,
  `toggleOn`,
  `virtualKey`,
  `virtualKeyRelease`,
] as const;

export type Vibrate = (typeof types)[number];

const trigger = (type: Vibrate) => {
  if (type === `none` || !Bridge.available) {
    return;
  }

  Bridge.hapticImpact(type);
};

export const Vibrate = { trigger };
