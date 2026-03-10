import { type CSSProperties, type PointerEventHandler, useCallback, useRef, useState } from "react";

import type { RippleProps } from "./Ripple";

const rippleSpeedPxPerS = 1000;

type RippleItem = { id: number; style: CSSProperties };

export const useRippleState = ({ center = false, children, disabled = false, speedFactor = 1 }: RippleProps) => {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const nextId = useRef(0);

  const wrapperRefCallback = useCallback((element: HTMLSpanElement | null) => {
    wrapperRef.current = element;
  }, []);

  const onPointerDown: PointerEventHandler = useCallback(
    event => {
      const element = wrapperRef.current;
      if (element === null || event.button !== 0) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const size = 2 * Math.max(rect.width, rect.height);
      const x = center ? rect.width / 2 : event.clientX - rect.left;
      const y = center ? rect.height / 2 : event.clientY - rect.top;
      const id = nextId.current++;
      const duration = (size / rippleSpeedPxPerS) * speedFactor;
      setRipples(previous => [
        ...previous,
        { id, style: { [`--ripple-duration` as string]: `${duration}s`, height: size, left: x, top: y, width: size } },
      ]);
    },
    [center, speedFactor],
  );

  const remove = useCallback((id: number) => {
    setRipples(previous => previous.filter(r => r.id !== id));
  }, []);

  return { children, disabled, onPointerDown, remove, ripples, wrapperRefCallback };
};
