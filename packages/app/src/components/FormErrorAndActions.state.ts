import type { FormErrorAndActionsProps } from "./FormErrorAndActions";

export const useFormErrorAndActionsState = ({ children, error }: FormErrorAndActionsProps) => {
  const showError = error !== ``;

  return { children, errorText: error, showError };
};
