import { Link as RouterLink } from "wouter";

import styles from "./Button.module.scss";
import { Icon, type Icon as IconType } from "./Icon";
import { Ripple } from "./Ripple";

export type ButtonProps = {
  cn?: string;
  disabled?: boolean;
  href?: string;
  icon?: IconType;
  large?: boolean;
  onClick?: () => void;
  submit?: boolean;
  text: string;
  to?: string;
  type?: `default` | `link` | `primary`;
};

export const Button = ({
  cn = ``,
  disabled = false,
  href = ``,
  icon,
  large = false,
  onClick,
  submit = false,
  text,
  to = ``,
  type = `default`,
}: ButtonProps) => {
  const classNames = [
    styles.root,
    type === `primary` ? styles.primary : ``,
    type === `link` ? styles.link : ``,
    large ? styles.large : ``,
    cn,
  ]
    .filter(Boolean)
    .join(` `);

  const common = { className: classNames };

  const content = (
    <>
      {icon ? <Icon name={icon} /> : undefined}
      {text}
    </>
  );

  const hasTo = to !== ``;
  const hasHref = href !== ``;

  return (
    <span className={styles.wrapper}>
      <Ripple disabled={disabled}>
        {hasTo ? (
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
        )}
      </Ripple>
    </span>
  );
};
