import { Link as RouterLink } from "wouter";

import type { useButtonState } from "./Button.state";

import styles from "./Button.module.scss";
import { Icon } from "./Icon";
import { Splash } from "./Splash";

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
  onPointerDown,
  pressed,
  splashColor,
  submit,
  text,
  to,
  type,
  wrapperRef,
}: ButtonViewProps) => {
  const typeClass = styles[type];
  const classNames = [styles.root, typeClass, large ? styles.large : ``, cn].filter(Boolean).join(` `);
  const common = { className: classNames };
  const bgClass = [styles.rootBg, typeClass].filter(Boolean).join(` `);

  const splashContainerClass =
    type === `link` ? [styles.splashContainer, styles.canvasLayerBorder].join(` `) : styles.splashContainer;

  const content = (
    <>
      {icon === undefined ? undefined : <Icon name={icon} />}
      {text}
    </>
  );

  return (
    <span className={styles.wrapper} onPointerDown={onPointerDown} ref={wrapperRef}>
      <div aria-hidden className={bgClass} />
      {pressed !== undefined && (
        <div aria-hidden className={splashContainerClass}>
          <Splash color={splashColor} x={pressed.x} y={pressed.y} />
        </div>
      )}
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
    </span>
  );
};
