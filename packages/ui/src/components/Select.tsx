import { Field } from "./Field";
import { Icon } from "./Icon";
import styles from "./Select.module.css";

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
  <Field
    id={id}
    label={label}
    renderControl={({ inputClassName, inputInsideWrapClassName, wrapClassName }) => (
      <div className={wrapClassName}>
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
        <div className={styles.suffix}>
          <Icon name="chevron-down" />
        </div>
      </div>
    )}
  />
);
