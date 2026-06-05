import type { PasswordInputProps } from "./PasswordInput";

import { useNewPasswordInputState } from "./NewPasswordInput.state";
import { NewPasswordInputView } from "./NewPasswordInput.view";

export type NewPasswordInputProps = Omit<PasswordInputProps, `autoComplete`> & { autoComplete?: `new-password` };

export const NewPasswordInput = (props: NewPasswordInputProps) => (
  <NewPasswordInputView {...useNewPasswordInputState(props)} />
);
