import type { InputProps } from "./Input";

import { usePasswordInputState } from "./PasswordInput.state";
import { PasswordInputView } from "./PasswordInput.view";

export type PasswordInputProps = Omit<InputProps, `suffix` | `type`>;

export const PasswordInput = (props: PasswordInputProps) => <PasswordInputView {...usePasswordInputState(props)} />;
