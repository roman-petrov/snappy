import type { Icon } from "./Icon";

import { useButtonState } from "./Button.state";
import { ButtonView } from "./Button.view";

export type ButtonProps = {
  cn?: string;
  disabled?: boolean;
  href?: string;
  icon?: Icon;
  large?: boolean;
  onClick?: () => void;
  submit?: boolean;
  text: string;
  to?: string;
  type?: `default` | `link` | `primary`;
};

export const Button = (props: ButtonProps) => <ButtonView {...useButtonState(props)} />;
