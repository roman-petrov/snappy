import type { ReactNode } from "react";

import styles from "./Button.module.css";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  large?: boolean;
  onClick?: () => void;
  primary?: boolean;
  type?: `button` | `submit`;
};

export const Button = ({
  children,
  className = ``,
  disabled = false,
  href,
  large = false,
  onClick,
  primary = false,
  type = `button`,
}: ButtonProps) => {
  const classNames = [styles[`root`], primary ? styles[`primary`] : ``, large ? styles[`large`] : ``, className]
    .filter(Boolean)
    .join(` `);

  const isLink = href !== undefined;

  return isLink ? (
    <a
      className={classNames}
      href={href}
      onClick={onClick}
      rel={href.startsWith(`http`) ? `noopener` : undefined}
      target={href.startsWith(`http`) ? `_blank` : undefined}
    >
      {children}
    </a>
  ) : (
    <button className={classNames} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
