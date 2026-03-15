/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
import { AndroidBridge } from "./AndroidBridge";

/**
 * Mirrors Android HapticFeedbackConstants.
 * @see https://developer.android.com/reference/android/view/HapticFeedbackConstants
 */
const fallbackPatterns = {
  clockTick: [],
  confirm: [20],
  contextClick: [],
  dragStart: [],
  gestureEnd: [],
  gestureStart: [],
  gestureThresholdActivate: [],
  gestureThresholdDeactivate: [],
  keyboardRelease: [],
  keyboardTap: [],
  longPress: [],
  noHaptics: [],
  reject: [],
  segmentFrequentTick: [],
  segmentTick: [10],
  textHandleMove: [],
  toggleOff: [],
  toggleOn: [],
  virtualKey: [],
  virtualKeyRelease: [],
} as const;

export type Vibrate = keyof typeof fallbackPatterns;

const trigger = (type: Vibrate) => () => {
  if (AndroidBridge.available) {
    AndroidBridge.hapticImpact(type);
  } else {
    const pattern = fallbackPatterns[type];

    if (pattern.length > 0 && typeof navigator !== `undefined`) {
      navigator.vibrate(pattern);
    }
  }
};

const confirm = trigger(`confirm`);
const segmentTick = trigger(`segmentTick`);

export const Vibrate = { confirm, segmentTick };
