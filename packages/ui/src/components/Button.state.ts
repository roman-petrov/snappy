/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { type PointerEventHandler, useRef, useState } from "react";

import type { ButtonProps } from "./Button";

import { $theme } from "../Store";

type Pressed = { x: number; y: number };

export const useButtonState = ({
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
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [pressed, setPressed] = useState<Pressed | undefined>(undefined);

  const onPointerDown: PointerEventHandler<HTMLSpanElement> = event => {
    if (disabled || event.button !== 0) {
      return;
    }
    const element = wrapperRef.current;
    if (element === null) {
      return;
    }
    const rect = element.getBoundingClientRect();
    setPressed({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    const { pointerId } = event;

    const handler = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) {
        return;
      }
      unsubscribe();
      setPressed(undefined);
    };

    const unsubscribe = _.singleAction([
      Dom.subscribe(window, `pointerup`, handler),
      Dom.subscribe(window, `pointercancel`, handler),
    ]);
  };

  const hasTo = to !== ``;
  const hasHref = href !== ``;

  const splashColors = {
    default: { dark: 0xe0_e0_e6_73, light: 0x59_61_62_80 },
    link: { dark: 0x9e_e8_e0_73, light: 0x1a_9e_8c_60 },
    primary: { dark: 0xff_66_99_ff, light: 0xcc_99_ff_ff },
  };

  const splashColor = splashColors[type][$theme.value];

  return {
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
  };
};
