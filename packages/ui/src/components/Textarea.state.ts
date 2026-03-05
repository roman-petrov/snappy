import type { TextareaProps } from "./Textarea";

import { useScrollFieldOnFocus } from "../hooks";

export const useTextareaState = (props: TextareaProps) => {
  const onFocus = useScrollFieldOnFocus();

  return { ...props, onFocus };
};
