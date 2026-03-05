import type { FieldControlClasses } from "./Field";
import type { useSelectState } from "./Select.state";

import { Icon } from "./Icon";
import { Input } from "./Input";
import styles from "./Select.module.scss";

export type SelectViewProps = ReturnType<typeof useSelectState>;

export const SelectView = ({ disabled = false, id, label, onChange, onFocus, options, value }: SelectViewProps) => (
  <Input id={id} label={label} suffix={<Icon name="chevron-down" />}>
    {({ inputClassName, inputInsideWrapClassName }: FieldControlClasses) => (
      <select
        className={`${inputClassName} ${inputInsideWrapClassName} ${styles.input}`}
        disabled={disabled}
        id={id}
        onChange={event_ => onChange(event_.target.value)}
        onFocus={onFocus}
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
