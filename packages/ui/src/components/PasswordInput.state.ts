import { useState } from "react";

import type { PasswordInputProps } from "./PasswordInput";

export const usePasswordInputState = ({ hidePasswordLabel, showPasswordLabel, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(v => !v);
  const hideLabel = hidePasswordLabel ?? `Hide password`;
  const showLabel = showPasswordLabel ?? `Show password`;

  return {
    ...rest,
    ariaLabel: visible ? hideLabel : showLabel,
    inputType: visible ? `text` : `password`,
    toggleVisible,
    visible,
  };
};
