import { useLayoutEffect, useMemo, useRef } from "react";

import type { TextAreaProps } from "./TextArea";

import { ReactRef } from "../core/ReactRef";

const parsePx = (value: string) => Number.parseFloat(value);

export const useTextAreaState = ({
  ariaBusy,
  collapsed = false,
  maxLines,
  onBlur,
  onChange,
  onFocus,
  readOnly,
  ref: forwardedRef,
  value,
  ...rest
}: TextAreaProps) => {
  const elementRef = useRef<HTMLTextAreaElement | null>(null);
  const mergedRef = useMemo(() => ReactRef.merge(elementRef, forwardedRef), [forwardedRef]);
  const rafRef = useRef<number | undefined>(undefined);
  const blur = () => onBlur?.();
  const focus = () => onFocus?.();

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (element !== null) {
      const scrollTopBefore = element.scrollTop;
      const lockedHeight = Math.round(element.getBoundingClientRect().height);
      const style = window.getComputedStyle(element);
      const lineHeight = parsePx(style.lineHeight);
      const paddingTop = parsePx(style.paddingTop);
      const paddingBottom = parsePx(style.paddingBottom);
      const oneLineHeight = Math.round(lineHeight + paddingTop + paddingBottom);
      const maxHeight = Math.round(lineHeight * maxLines + paddingTop + paddingBottom);
      element.style.overflowY = `hidden`;
      element.style.height = `auto`;
      const contentHeight = Math.round(element.scrollHeight);
      element.style.height = `${lockedHeight}px`;
      element.scrollTop = scrollTopBefore;

      const expandedHeight = Math.min(contentHeight, maxHeight);

      const collapsedHeight =
        contentHeight <= oneLineHeight + 1 ? Math.min(contentHeight, oneLineHeight) : oneLineHeight;

      const nextHeight = collapsed ? collapsedHeight : expandedHeight;
      const overflow = contentHeight > maxHeight;

      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        element.style.height = `${nextHeight}px`;
        element.style.overflowY = !collapsed && overflow ? `auto` : `hidden`;

        const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);

        const caretAtEnd =
          element.selectionStart === element.value.length && element.selectionEnd === element.value.length;
        element.scrollTop = overflow && caretAtEnd ? maxScroll : Math.min(scrollTopBefore, maxScroll);

        rafRef.current = undefined;
      });
    }

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, [collapsed, maxLines, value]);

  return { ...rest, ariaBusy, blur, focus, onChange, readOnly, ref: mergedRef, value };
};
