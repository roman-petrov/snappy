import type { ReactNode } from "react";

import type { TapProps } from "./Tap";

import { useCheckboxState } from "./Checkbox.state";
import { CheckboxView } from "./Checkbox.view";

export type CheckboxProps = Omit<TapProps, `children`> & {
  checked?: boolean;
  children?: ReactNode;
  cn?: string;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = (props: CheckboxProps) => <CheckboxView {...useCheckboxState(props)} />;
