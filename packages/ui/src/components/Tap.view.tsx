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
  const common = {
    "aria-busy": ariaBusy,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressed,
    children,
    "className": _.cn(styles.root, cn),
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
      />
    );
  }

  return <button {...common} disabled={disabled} onClick={buttonOnClick} type={submit ? `submit` : `button`} />;
};
