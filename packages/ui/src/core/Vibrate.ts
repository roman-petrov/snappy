/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
import { AndroidBridge } from "./AndroidBridge";

/**
 * ? https://developer.android.com/reference/android/view/HapticFeedbackConstants
 * ? https://source.android.com/docs/core/interaction/haptics/haptics-ux-foundation
 */
const fallbackPatterns = {
  clockTick: [],
  confirm: [8],
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
  segmentTick: [3],
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
