/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { usePasswordInputState } from "./PasswordInput.state";

import { css } from "../../styled-system/css";
import { Icon } from "./Icon";

export type PasswordInputViewProps = ReturnType<typeof usePasswordInputState>;

export const PasswordInputView = ({
  ariaLabel,
  autoComplete = "current-password",
  disabled = false,
  id,
  inputType,
  label,
  minLength,
  onChange,
  required = false,
  toggleVisible,
  value,
  visible,
}: PasswordInputViewProps) => (
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
    <div
      className={css({
        _focusWithin: { borderColor: "accent", boxShadow: "focusRing" },
        alignItems: "stretch",
        bg: "bg",
        border: "{borderWidths.thin} solid {colors.border}",
        borderRadius: "sm",
        boxSizing: "border-box",
        display: "flex",
        minHeight: "10",
        transitionDuration: "fast",
        transitionProperty: "border-color, box-shadow",
        transitionTimingFunction: "default",
      })}
    >
      <input
        aria-label={label}
        autoComplete={autoComplete}
        className={css({
          _focus: { outline: "none" },
          _placeholder: { color: "text.muted" },
          bg: "transparent",
          border: "none",
          borderRadius: "sm",
          boxSizing: "border-box",
          color: "text.body",
          flex: "1",
          fontFamily: "inherit",
          fontSize: "base",
          lineHeight: "relaxed",
          minHeight: "10",
          minWidth: "0",
          paddingBlock: "3",
          paddingInline: "4",
        })}
        disabled={disabled}
        id={id}
        minLength={minLength}
        onChange={event => onChange(event.target.value)}
        required={required}
        type={inputType as "password" | "text"}
        value={value}
      />
      <button
        aria-label={ariaLabel}
        className={css({
          _disabled: { cursor: "not-allowed", opacity: 0.5 },
          _focus: { color: "accent", outline: "none" },
          _focusVisible: {
            outline: "{borderWidths.medium} solid {colors.accent}",
            outlineOffset: "2",
          },
          _hover: { color: "text.body" },
          alignItems: "center",
          appearance: "none",
          bg: "transparent",
          border: "none",
          borderColor: "border",
          borderInlineStart: "{borderWidths.thin} solid {colors.border}",
          color: "text.muted",
          cursor: "pointer",
          display: "flex",
          flexShrink: 0,
          fontFamily: "inherit",
          fontSize: "inherit",
          justifyContent: "center",
          padding: "0",
          transitionDuration: "fast",
          transitionProperty: "color",
          transitionTimingFunction: "default",
          width: "10",
        })}
        disabled={disabled}
        onClick={toggleVisible}
        title={ariaLabel}
        type="button"
      >
        <Icon
          cn={css({
            alignItems: "center",
            display: "flex",
          fontSize: "iconSm",
          height: "iconSm",
            justifyContent: "center",
            width: "iconSm",
          })}
          name={visible ? "eye-closed" : "eye-open"}
        />
      </button>
    </div>
  </div>
);
