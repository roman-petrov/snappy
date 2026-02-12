import { useState } from "react";

import type { PasswordInputProps } from "./PasswordInput";

export const usePasswordInputState = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(v => !v);

  return {
    ...props,
    ariaLabel: visible ? `Скрыть пароль` : `Показать пароль`,
    inputType: visible ? `text` : `password`,
    toggleVisible,
    visible,
  };
};
