import type { InputProps } from "./Input";

import { useScrollFieldOnFocus } from "../hooks";

export const useInputState = (props: InputProps) => {
  const onFocus = useScrollFieldOnFocus();

  return { ...props, onFocus };
};
