import alertError from "./alert-error.svg?raw";
import alertInfo from "./alert-info.svg?raw";
import alertSuccess from "./alert-success.svg?raw";
import alertWarning from "./alert-warning.svg?raw";
import eyeClosed from "./eye-closed.svg?raw";
import eyeOpen from "./eye-open.svg?raw";
import microphone from "./microphone.svg?raw";
import process from "./process.svg?raw";
import settingsHide from "./settings-hide.svg?raw";
import settingsShow from "./settings-show.svg?raw";
import telegram from "./telegram.svg?raw";

export const Icons = {
  "alert-error": alertError,
  "alert-info": alertInfo,
  "alert-success": alertSuccess,
  "alert-warning": alertWarning,
  "eye-closed": eyeClosed,
  "eye-open": eyeOpen,
  microphone,
  process,
  "settings-hide": settingsHide,
  "settings-show": settingsShow,
  telegram,
} as const;
