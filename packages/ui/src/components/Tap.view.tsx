import { _ } from "@snappy/core";

import type { useTapState } from "./Tap.state";

import styles from "./Tap.module.scss";

export type TapViewProps = ReturnType<typeof useTapState>;

export const TapView = ({
  ariaBusy,
  ariaLabel,
  ariaPressed,
  buttonOnClick,
  children,
  cn,
  disabled,
  linkHref,
  linkRelationship,
  linkTarget,
  onLinkClick,
  onMouseDown,
  renderAsLink,
  submit,
  title,
}: TapViewProps) => {
  const classNames = _.cn(styles.root, cn);

  const common = {
    "aria-busy": ariaBusy,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressed,
    "className": classNames,
    onMouseDown,
    title,
  };

  if (renderAsLink && linkHref !== undefined) {
    return (
      <a
        {...common}
        aria-disabled={disabled || undefined}
        href={linkHref}
        onClick={onLinkClick}
        rel={linkRelationship}
        role="link"
        target={linkTarget}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...common} disabled={disabled} onClick={buttonOnClick} type={submit ? `submit` : `button`}>
      {children}
    </button>
  );
};
