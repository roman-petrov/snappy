import { useState } from "react";

import type { PasswordInputProps } from "./PasswordInput";

export const usePasswordInputState = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(v => !v);
  const hideLabel = props.hidePasswordLabel ?? `Hide password`;
  const showLabel = props.showPasswordLabel ?? `Show password`;

  return {
    ...props,
    ariaLabel: visible ? hideLabel : showLabel,
    inputType: visible ? `text` : `password`,
    toggleVisible,
    visible,
  };
};
