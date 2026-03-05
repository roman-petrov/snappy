import type { SelectProps } from "./Select";

import { useScrollFieldOnFocus } from "../hooks";

export const useSelectState = (props: SelectProps) => {
  const onFocus = useScrollFieldOnFocus();

  return { ...props, onFocus };
};
