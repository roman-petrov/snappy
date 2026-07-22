import type { ComponentProps, HTMLInputAutoCompleteAttribute, ReactNode } from "react";

import { useInputState } from "./Input.state";
import { InputView } from "./Input.view";

export type InputProps = {
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  inputMode?: ComponentProps<`input`>[`inputMode`];
  label: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  overlay?: ReactNode;
  suffix?: ReactNode;
  type?: `email` | `password` | `text`;
  value: string;
};

export const Input = (props: InputProps) => <InputView {...useInputState(props)} />;
