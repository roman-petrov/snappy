import type { ReactNode } from "react";

import styles from "./Button.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  large?: boolean;
  primary?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export const Button = ({
  children,
  className = ``,
  disabled = false,
  href,
  large = false,
  primary = false,
  type = `button`,
  onClick,
}: Props) => {
  const classNames = [
    styles[`root`],
    primary ? styles[`primary`] : ``,
    large ? styles[`large`] : ``,
    className,
  ]
    .filter(Boolean)
    .join(` `);

  if (href !== undefined) {
    return (
      <a
        className={classNames}
        href={href}
        rel={href.startsWith(`http`) ? `noopener` : undefined}
        target={href.startsWith(`http`) ? `_blank` : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  );
};
