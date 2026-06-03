import type { SubmitEventHandler } from "react";

import type { AuthFormProps } from "./AuthForm";

export const useAuthFormState = ({ submit, ...rest }: AuthFormProps) => {
  const onSubmit: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    submit();
  };

  return { ...rest, submit: onSubmit };
};
