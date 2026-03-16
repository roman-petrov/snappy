import type { SubmitEventHandler } from "react";

import { useIsMobile } from "@snappy/ui";

import type { AuthFormProps } from "./AuthForm";

export const useAuthFormState = ({ submit, ...rest }: AuthFormProps) => {
  const mobile = useIsMobile();

  const onSubmit: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    submit();
  };

  return { ...rest, mobile, submit: onSubmit };
};
