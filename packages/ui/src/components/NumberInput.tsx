import type { InputProps } from "./Input";

import { useNumberInputState } from "./NumberInput.state";
import { NumberInputView } from "./NumberInput.view";

export type NumberInputProps = Omit<InputProps, `onBlur` | `onChange` | `type` | `value`> & {
  onBlur?: () => void;
  onChange: (value: number | undefined) => void;
  value: number | undefined;
};

export const NumberInput = (props: NumberInputProps) => <NumberInputView {...useNumberInputState(props)} />;
