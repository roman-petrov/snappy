/**
 * Mirrors Android HapticFeedbackConstants.
 * @see https://developer.android.com/reference/android/view/HapticFeedbackConstants
 */
export const AndroidHapticFeedbackConstants = {
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
} as const;

export type AndroidHapticFeedbackConstants = keyof typeof AndroidHapticFeedbackConstants;
