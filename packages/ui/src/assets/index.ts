import eyeClosed from "./eye-closed.svg?raw";
import eyeOpen from "./eye-open.svg?raw";
import telegram from "./telegram.svg?raw";

export const iconSvg = { "eye-closed": eyeClosed, "eye-open": eyeOpen, telegram } as const;

export type IconName = keyof typeof iconSvg;
