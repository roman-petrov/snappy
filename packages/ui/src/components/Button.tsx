import type { ReactNode } from "react";

import styles from "./Button.module.scss";
import { Icon } from "./Icon";

export type ButtonProps = {
  children: ReactNode;
  cn?: string;
  disabled?: boolean;
  href?: string;
  icon?: Icon;
  large?: boolean;
  onClick?: () => void;
  primary?: boolean;
  type?: `button` | `submit`;
};

export const Button = ({
  children,
  cn = ``,
  disabled = false,
  href,
  icon,
  large = false,
  onClick,
  primary = false,
  type = `button`,
}: ButtonProps) => {
  const classNames = [styles.root, primary ? styles.primary : ``, large ? styles.large : ``, cn]
    .filter(Boolean)
    .join(` `);

  const isLink = href !== undefined;

  const content = (
    <>
      {icon ? <Icon name={icon} /> : undefined}
      {children}
    </>
  );

  return isLink ? (
    <a
      className={classNames}
      href={href}
      onClick={onClick}
      rel={href.startsWith(`http`) ? `noopener` : undefined}
      target={href.startsWith(`http`) ? `_blank` : undefined}
    >
      {content}
    </a>
  ) : (
    <button className={classNames} disabled={disabled} onClick={onClick} type={type}>
      {content}
    </button>
  );
};
