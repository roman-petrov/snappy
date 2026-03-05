import type { ReactNode } from "react";

import type { FieldControlClasses } from "./Field";

import { useInputState } from "./Input.state";
import { InputView } from "./Input.view";

export type InputProps =
  | {
      autoComplete?: string;
      children?: never;
      disabled?: boolean;
      id: string;
      inputClassName?: string;
      label?: string;
      minLength?: number;
      onChange: (value: string) => void;
      required?: boolean;
      suffix?: ReactNode;
      type?: `email` | `password` | `text`;
      value: string;
    }
  | {
      children: (classes: FieldControlClasses) => ReactNode;
      disabled?: boolean;
      id: string;
      label?: string;
      suffix?: ReactNode;
    };

export const Input = (props: InputProps) => <InputView {...useInputState(props)} />;
