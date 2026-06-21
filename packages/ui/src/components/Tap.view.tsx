import { _ } from "@snappy/core";

import type { useTapState } from "./Tap.state";

import styles from "./Tap.module.scss";

export type TapViewProps = ReturnType<typeof useTapState>;

export const TapView = ({
  buttonOnClick,
  children,
  cn,
  disabled,
  linkHref,
  linkRelationship,
  linkTarget,
  onLinkClick,
  pointerDown,
  renderAsLink,
  submit,
  title,
}: TapViewProps) => {
  const common = { children, className: _.cn(styles.root, cn), onPointerDown: pointerDown, title };

  if (renderAsLink && linkHref !== undefined) {
    return (
      <a
        {...common}
        data-disabled={disabled ? `true` : undefined}
        href={linkHref}
        onClick={onLinkClick}
        rel={linkRelationship}
        target={linkTarget}
      />
    );
  }

  return <button {...common} disabled={disabled} onClick={buttonOnClick} type={submit ? `submit` : `button`} />;
};
