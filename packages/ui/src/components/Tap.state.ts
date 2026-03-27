import { _ } from "@snappy/core";
import { useHref } from "react-router-dom";

import type { TapProps } from "./Tap";

import { AndroidBridge } from "../core/AndroidBridge";
import { Vibrate } from "../core/Vibrate";
import { useGo } from "../hooks/useGo";

export const useTapState = ({
  ariaBusy,
  ariaPressed,
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
  const go = useGo();
  const isExternal = _.isObject(link);
  const isHash = _.isString(link) && link.startsWith(`#`);
  const spaPath = _.isString(link) && !isHash ? link : undefined;
  const spaHref = useHref(spaPath ?? `/`);
  const useJsNavigation = AndroidBridge.available && spaPath !== undefined;

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
    ariaBusy,
    ariaLabel: tip,
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
    title: tip,
  };
};
