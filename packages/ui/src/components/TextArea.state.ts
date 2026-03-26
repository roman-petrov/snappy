import { useLayoutEffect, useRef, useState } from "react";

import type { TextAreaProps } from "./TextArea";

const parsePx = (value: string) => Number.parseFloat(value);

export const useTextAreaState = ({ maxLines, onChange, value, ...rest }: TextAreaProps) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const blur = () => setFocused(false);
  const focus = () => setFocused(true);
  const onTextChange = onChange;

  useLayoutEffect(() => {
    const element = textareaRef.current;

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

      const nextHeight = focused ? expandedHeight : collapsedHeight;
      const overflow = contentHeight > maxHeight;

      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        element.style.height = `${nextHeight}px`;
        element.style.overflowY = focused && overflow ? `auto` : `hidden`;

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
  }, [focused, maxLines, value]);

  return { ...rest, blur, focus, onTextChange, textareaRef, value };
};
