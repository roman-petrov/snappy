/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

import { SwitchDisplay } from "./SwitchDisplay";
import styles from "./SwitchDisplay.module.scss";
import { Tap, type TapProps } from "./Tap";

export type SwitchProps = Omit<TapProps, `children`> & {
  checked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
};

export const Switch = ({ checked = false, cn, label, onChange, ...tapProps }: SwitchProps) => {
  const { disabled, onClick } = tapProps;

  return (
    <Tap
      {...tapProps}
      ariaPressed={checked}
      cn={_.cn(styles.tap, cn)}
      onClick={() => {
        if (onClick !== undefined) {
          onClick();
        }
        if (onChange !== undefined) {
          onChange(!checked);
        }
      }}
      tip={label}
    >
      <SwitchDisplay checked={checked} disabled={disabled} />
    </Tap>
  );
};
