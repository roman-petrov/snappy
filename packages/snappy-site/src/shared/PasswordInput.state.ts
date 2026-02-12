import { useState } from "react";

import type { PasswordInputProps } from "./PasswordInput";

import { t } from "../app/core/Locale";

export const usePasswordInputState = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(v => !v);

  return {
    ...props,
    ariaLabel: visible ? t(`passwordInput.hidePassword`) : t(`passwordInput.showPassword`),
    inputType: visible ? `text` : `password`,
    toggleVisible,
    visible,
  };
};
