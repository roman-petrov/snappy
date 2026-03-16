import type { PasswordInputProps } from "./PasswordInput";

import { useToggle } from "../hooks";

export const usePasswordInputState = (props: PasswordInputProps) => {
  const [visible, toggleVisible] = useToggle(false);

  return { ...props, toggleVisible, visible };
};
