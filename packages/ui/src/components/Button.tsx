import type { ReactNode } from "react";

import { css, cva, cx } from "../../styled-system/css";
import { Icon } from "./Icon";

export type ButtonVariantProps = { size?: "default" | "large"; variant?: "default" | "primary" };

export type ButtonProps = ButtonVariantProps & {
  children: ReactNode;
  cn?: string;
  disabled?: boolean;
  href?: string;
  icon?: Icon;
  large?: boolean;
  onClick?: () => void;
  primary?: boolean;
  type?: "button" | "submit";
};

export const Button = ({
  children,
  cn = "",
  disabled = false,
  href,
  icon,
  large = false,
  onClick,
  primary = false,
  size,
  type = "button",
  variant,
}: ButtonProps) => {
  const classNames = cx(
    cva({
      base: {
        _disabled: { cursor: "not-allowed", opacity: 0.6, transform: "none" },
        _focusVisible: {
          outline: "{borderWidths.medium} solid {colors.accent}",
          outlineOffset: "2",
        },
        border: "none",
        borderRadius: "sm",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "inline-block",
        fontFamily: "inherit",
        fontSize: "base",
        fontWeight: "semibold",
        lineHeight: "tight",
        minHeight: "8",
        paddingBlock: "3",
        paddingInline: "6",
        textDecoration: "none",
        transitionDuration: "fast",
        transitionProperty: "transform, box-shadow, outline-color",
        transitionTimingFunction: "default",
      },
      compoundVariants: [{ css: { fontSize: "lg" }, size: "large", variant: "primary" }],
      defaultVariants: { size: "default", variant: "default" },
      variants: {
        size: {
          default: {},
          large: { fontSize: "md", minHeight: "10", paddingBlock: "4", paddingInline: "8" },
        },
        variant: {
          default: {},
          primary: {
            _hover: { boxShadow: "btnHover", textDecoration: "none", transform: "translateY(-2px)" },
            bg: "accent",
            boxShadow: "btn",
            color: "onAccent",
          },
        },
      },
    })({ size: size ?? (large ? "large" : "default"), variant: variant ?? (primary ? "primary" : "default") }),
    cn,
  );
  const isLink = href !== undefined;
  const content = (
    <span className={css({ alignItems: "center", display: "inline-flex", gap: "2" })}>
      {icon ? <Icon name={icon} size="button" /> : undefined}
      {children}
    </span>
  );

  return isLink ? (
    <a
      className={classNames}
      href={href}
      onClick={onClick}
      rel={href.startsWith("http") ? "noopener" : undefined}
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      {content}
    </a>
  ) : (
    <button className={classNames} disabled={disabled} onClick={onClick} type={type}>
      {content}
    </button>
  );
};
