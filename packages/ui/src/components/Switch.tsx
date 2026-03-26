/* eslint-disable functional/no-expression-statements */
import { SwitchDisplay } from "./SwitchDisplay";
import { Tap, type TapProps } from "./Tap";

export type SwitchProps = Omit<TapProps, `children`> & {
  checked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
};

export const Switch = ({ checked = false, label, onChange, ...tapProps }: SwitchProps) => {
  const { disabled, onClick } = tapProps;

  return (
    <Tap
      {...tapProps}
      ariaPressed={checked}
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
