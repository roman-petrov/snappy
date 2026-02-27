import type { FieldControlClasses } from "./Field";

import { Icon } from "./Icon";
import { Input } from "./Input";
import styles from "./Select.module.scss";

export type SelectOption = { label: string; value: string };

export type SelectProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

export const Select = ({ disabled = false, id, label, onChange, options, value }: SelectProps) => (
  <Input id={id} label={label} suffix={<Icon name="chevron-down" />}>
    {({ inputClassName, inputInsideWrapClassName }: FieldControlClasses) => (
      <select
        className={`${inputClassName} ${inputInsideWrapClassName} ${styles.input}`}
        disabled={disabled}
        id={id}
        onChange={event_ => onChange(event_.target.value)}
        value={value}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )}
  </Input>
);
