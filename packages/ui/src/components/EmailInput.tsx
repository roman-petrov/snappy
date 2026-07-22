import { Input, type InputProps } from "./Input";

export type EmailInputProps = Omit<InputProps, `inputMode` | `type`>;

export const EmailInput = ({ autoComplete = `email`, ...rest }: EmailInputProps) => (
  <Input {...rest} autoComplete={autoComplete} type="email" />
);
