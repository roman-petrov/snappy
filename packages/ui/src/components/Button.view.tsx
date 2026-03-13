import { Link as RouterLink } from "wouter";

import type { useButtonState } from "./Button.state";

import styles from "./Button.module.scss";
import { Icon } from "./Icon";

export type ButtonViewProps = ReturnType<typeof useButtonState>;

export const ButtonView = ({
  cn,
  disabled,
  hasHref,
  hasTo,
  href,
  icon,
  large,
  onClick,
  submit,
  text,
  to,
  type,
}: ButtonViewProps) => {
  const typeClass = styles[type];
  const classNames = [styles.root, typeClass, large ? styles.large : ``, cn].filter(Boolean).join(` `);
  const common = { className: classNames };

  const content = (
    <>
      {icon === undefined ? undefined : <Icon name={icon} />}
      {text}
    </>
  );

  return hasTo ? (
    <RouterLink {...common} href={to} onClick={onClick} transition>
      {content}
    </RouterLink>
  ) : hasHref ? (
    <a
      {...common}
      href={href}
      onClick={onClick}
      rel={href.startsWith(`http`) ? `noopener` : undefined}
      target={href.startsWith(`http`) ? `_blank` : undefined}
    >
      {content}
    </a>
  ) : (
    <button {...common} disabled={disabled} onClick={onClick} type={submit ? `submit` : `button`}>
      {content}
    </button>
  );
};
