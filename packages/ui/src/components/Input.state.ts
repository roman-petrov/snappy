import { useId } from "react";

import type { InputProps } from "./Input";

import { useScrollFieldOnFocus } from "../hooks";

export const useInputState = (props: InputProps) => {
  const onFocus = useScrollFieldOnFocus();
  const id = useId();

  return { ...props, id, onFocus };
};
