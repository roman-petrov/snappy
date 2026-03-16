import type { HTMLInputAutoCompleteAttribute, ReactNode } from "react";

import { useInputState } from "./Input.state";
import { InputView } from "./Input.view";

export type InputProps = {
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  label: string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  suffix?: ReactNode;
  type?: `email` | `password` | `text`;
  value: string;
};

export const Input = (props: InputProps) => <InputView {...useInputState(props)} />;
