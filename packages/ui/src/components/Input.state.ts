import { useId } from "react";

import type { InputProps } from "./Input";

export const useInputState = (props: InputProps) => {
  const id = useId();

  return { ...props, id };
};
