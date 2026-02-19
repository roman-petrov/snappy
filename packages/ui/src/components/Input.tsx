import { cx, css } from "../../styled-system/css";

export type InputProps = {
  autoComplete?: string;
  disabled?: boolean;
  id: string;
  inputClassName?: string;
  label?: string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "email" | "password" | "text";
  value: string;
};

export const Input = ({
  autoComplete,
  disabled = false,
  id,
  inputClassName,
  label,
  minLength,
  onChange,
  required = false,
  type = "text",
  value,
}: InputProps) => {
  const inputElement = (
    <input
      autoComplete={autoComplete}
      className={cx(
        css({
          _focus: { borderColor: "accent", boxShadow: "focusRing", outline: "none" },
          _placeholder: { color: "text.muted" },
          bg: "bg",
          border: "{borderWidths.thin} solid {colors.border}",
          borderRadius: "sm",
          boxSizing: "border-box",
          color: "text.body",
          fontFamily: "inherit",
          fontSize: "base",
          lineHeight: "relaxed",
          minHeight: "10",
          paddingBlock: "3",
          paddingInline: "4",
          transitionDuration: "fast",
          transitionProperty: "border-color, box-shadow",
          transitionTimingFunction: "default",
          width: "full",
        }),
        inputClassName,
      )}
      disabled={disabled}
      id={id}
      minLength={minLength}
      onChange={event => onChange(event.target.value)}
      required={required}
      type={type}
      value={value}
    />
  );

  if (label === undefined) {
    return inputElement;
  }

  return (
    <div className={css({ marginBottom: "4" })}>
      <label
        className={css({
          color: "text.muted",
          display: "block",
          fontSize: "sm",
          fontWeight: "medium",
          marginBottom: "2",
        })}
        htmlFor={id}
      >
        {label}
      </label>
      {inputElement}
    </div>
  );
};
