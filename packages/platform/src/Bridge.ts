/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Vibrate } from "./Vibrate";

type Haptic = Exclude<Vibrate, `none`>;

const hapticFeedbackConstants: Record<Haptic, number> = {
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

const systemThemeChangedEvent = `snappy:system-theme-changed` as const;
const keyboardChangedEvent = `snappy:keyboard-changed` as const;

type KeyboardChangedDetail = { open: boolean };

type NativeBridge = {
  copyHtml: (html: string, plain: string) => void;
  copyImage: (base64: string, name: string, extension: string) => void;
  hapticImpact: (constant: number) => void;
  isSystemDark: () => boolean;
  screenCornerRadius: () => number;
  setBarStyle: (theme: string) => void;
  shareHtml: (html: string, plain: string, title: string) => void;
  shareImage: (base64: string, mime: string, title: string, extension: string) => void;
};

declare global {
  interface Window {
    Bridge?: NativeBridge;
  }

  interface WindowEventMap {
    [keyboardChangedEvent]: CustomEvent<KeyboardChangedDetail>;
    [systemThemeChangedEvent]: Event;
  }
}

const native = typeof window === `undefined` ? undefined : window.Bridge;
const available = native !== undefined;
const hapticImpact = (constant: Haptic) => native?.hapticImpact(hapticFeedbackConstants[constant]);
const systemDark = () => native?.isSystemDark();
const screenCornerRadius = () => native?.screenCornerRadius() ?? 0;
const setBarStyle = (style: BarStyle) => native?.setBarStyle(style);
const copyHtml = (html: string, plain: string) => native?.copyHtml(html, plain);
const copyImage = (base64: string, name: string, extension: string) => native?.copyImage(base64, name, extension);
const shareHtml = (html: string, plain: string, title: string) => native?.shareHtml(html, plain, title);

const shareImage = (base64: string, mime: string, title: string, extension: string) =>
  native?.shareImage(base64, mime, title, extension);

export const Bridge = {
  available,
  copyHtml,
  copyImage,
  hapticImpact,
  keyboardChangedEvent,
  screenCornerRadius,
  setBarStyle,
  shareHtml,
  shareImage,
  systemDark,
  systemThemeChangedEvent,
};
