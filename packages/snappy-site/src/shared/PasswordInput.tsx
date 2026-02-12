import { usePasswordInputState } from "./PasswordInput.state";
import { PasswordInputView } from "./PasswordInput.view";

export type PasswordInputProps = {
  autoComplete?: `current-password` | `new-password`;
  disabled?: boolean;
  id: string;
  label: string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
};

export const PasswordInput = (props: PasswordInputProps) => <PasswordInputView {...usePasswordInputState(props)} />;
