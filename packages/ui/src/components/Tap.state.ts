import { useRouterGo, useRouterHref } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { Bridge, Vibrate } from "@snappy/platform";

import type { TapProps } from "./Tap";

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
    if (spaPath !== undefined) {
      void go(spaPath);
    }
    onClick?.();
  };

  const renderAsLink = link !== undefined && !useJsNavigation;
  const buttonOnClick = link === undefined ? onClick : useJsNavigation ? handleLinkClick : undefined;
  const linkHref = link === undefined ? undefined : isHash ? link : isExternal ? link.href : spaHref;
  const linkRelationship = isExternal ? link.rel : undefined;
  const linkTarget = isExternal ? link.target : undefined;
  const onLinkClick = renderAsLink && !isExternal && !isHash ? handleLinkClick : undefined;

  const pointerDown =
    keepFocus || vibrate !== undefined
      ? (event: { preventDefault: () => void }) => {
          if (keepFocus) {
            event.preventDefault();
          }
          if (!disabled && vibrate !== undefined) {
            Vibrate.trigger(vibrate);
          }
        }
      : undefined;

  return {
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
    title: tip,
  };
};
