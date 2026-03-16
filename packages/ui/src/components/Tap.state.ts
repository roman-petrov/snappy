import { _ } from "@snappy/core";
import { useHref } from "react-router-dom";

import type { TapProps } from "./Tap";

import { useGo } from "../hooks/useGo";
import { useIsMobile } from "../hooks/useIsMobile";

export const useTapState = ({
  ariaBusy,
  ariaLabel,
  ariaPressed,
  children,
  cn = ``,
  disabled = false,
  link,
  onClick,
  submit = false,
  title,
}: TapProps) => {
  const go = useGo();
  const isMobile = useIsMobile();
  const isExternal = _.isObject(link);
  const isHash = _.isString(link) && link.startsWith(`#`);
  const spaPath = _.isString(link) && !isHash ? link : undefined;
  const spaHref = useHref(spaPath ?? `/`);

  const handleLinkClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    if (spaPath !== undefined) {
      void go(spaPath);
    }
    onClick?.();
  };

  const renderAsLink = link !== undefined && !isMobile;
  const buttonOnClick = link === undefined ? onClick : handleLinkClick;
  const linkHref = link === undefined ? undefined : isHash ? link : isExternal ? link.href : spaHref;
  const linkRelationship = isExternal ? link.rel : undefined;
  const linkTarget = isExternal ? link.target : undefined;
  const onLinkClick = renderAsLink && !isExternal && !isHash ? handleLinkClick : undefined;

  return {
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
    renderAsLink,
    submit,
    title,
  };
};
