import { _ } from "@snappy/core";
import { Bridge, Vibrate } from "@snappy/platform";

import type { TapProps } from "./Tap";

import { useRouterGo, useRouterHref } from "../router";

export const useTapState = ({
  children,
  cn = ``,
  disabled = false,
  keepFocus = false,
  link,
  onClick,
  submit = false,
  tip,
  vibrate,
}: TapProps) => {
  const go = useRouterGo();
  const href = useRouterHref();
  const isExternal = _.isObject(link);
  const isHash = _.isString(link) && link.startsWith(`#`);
  const spaPath = _.isString(link) && !isHash ? link : undefined;
  const spaHref = href(spaPath ?? `/`);
  const useJsNavigation = Bridge.available && spaPath !== undefined;

  const handleLinkClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    if (vibrate !== undefined) {
      Vibrate.trigger(vibrate);
    }
    if (spaPath !== undefined) {
      void go(spaPath);
    }
    onClick?.();
  };

  const renderAsLink = link !== undefined && !useJsNavigation;

  const buttonOnClick =
    link === undefined
      ? onClick === undefined
        ? undefined
        : () => {
            if (vibrate !== undefined) {
              Vibrate.trigger(vibrate);
            }
            onClick();
          }
      : useJsNavigation
        ? handleLinkClick
        : undefined;

  const linkHref = link === undefined ? undefined : isHash ? link : isExternal ? link.href : spaHref;
  const linkRelationship = isExternal ? link.rel : undefined;
  const linkTarget = isExternal ? link.target : undefined;
  const onLinkClick = renderAsLink && !isExternal && !isHash ? handleLinkClick : undefined;
  const onMouseDown = keepFocus ? (event: { preventDefault: () => void }) => event.preventDefault() : undefined;

  return {
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
    title: tip,
  };
};
