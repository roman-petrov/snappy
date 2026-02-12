import type { ReactNode } from "react";

import styles from "./Button.module.css";

interface Props {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  large?: boolean;
  onClick?: () => void;
  primary?: boolean;
  type?: `button` | `submit`;
}

export const Button = ({
  children,
  className = ``,
  disabled = false,
  href,
  large = false,
  onClick,
  primary = false,
  type = `button`,
}: Props) => {
  const classNames = [styles[`root`], primary ? styles[`primary`] : ``, large ? styles[`large`] : ``, className]
    .filter(Boolean)
    .join(` `);

  if (href !== undefined) {
    return (
      <a
        className={classNames}
        href={href}
        onClick={onClick}
        rel={href.startsWith(`http`) ? `noopener` : undefined}
        target={href.startsWith(`http`) ? `_blank` : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
