/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { type CSSProperties, type PointerEventHandler, useEffect, useLayoutEffect, useRef } from "react";

import type { SplashProps } from "./Splash";

import { useSignalState } from "../hooks";
import { Sparkle } from "../web-gl";

export type Burst = { id: number; pointerId?: number; releaseTime?: number; startTime: number; x: number; y: number };

const singleBurstId = 0;

export const useSplashState = ({
  backgroundClassName,
  canvasLayerClassName,
  children,
  disabled = false,
  palette,
}: SplashProps) => {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglRef = useRef<Sparkle | undefined>(undefined);
  const rafRef = useRef(0);
  const [burst, setBurst] = useSignalState<Burst | undefined>(undefined);
  const burstRef = useRef(burst);
  burstRef.current = burst;

  const setWrapperRef = (element: HTMLSpanElement | null) => {
    wrapperRef.current = element;
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas === null || container === null) {
      return _.noop;
    }

    const webgl = Sparkle(canvas, palette.color);
    if (webgl === undefined) {
      return _.noop;
    }
    webglRef.current = webgl;

    return () => {
      webgl.destroy();
      webglRef.current = undefined;
    };
  }, [palette.color]);

  const releaseBurst = (pointerId: number) =>
    setBurst(previous =>
      previous?.pointerId === pointerId ? { ...previous, releaseTime: performance.now() } : previous,
    );

  const addWindowReleaseListener = (pointerId: number) => {
    const up = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) {
        return;
      }
      unsubscribe();
      releaseBurst(pointerId);
    };

    const unsubscribe = _.singleAction([
      Dom.subscribe(window, `pointerup`, up),
      Dom.subscribe(window, `pointercancel`, up),
    ]);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const webgl = webglRef.current;
    if (wrapper === null || canvas === null || webgl === undefined || burst === undefined) {
      return _.noop;
    }

    const tick = () => {
      const { current } = burstRef;
      if (current === undefined) {
        return;
      }
      const wrapperRect = wrapper.getBoundingClientRect();
      const { width } = wrapperRect;
      const { height } = wrapperRect;

      if (width <= 0 || height <= 0) {
        rafRef.current = requestAnimationFrame(tick);

        return;
      }
      const containerElement = containerRef.current;
      const canvasW = containerElement === null ? width : containerElement.clientWidth || width;
      const canvasH = containerElement === null ? height : containerElement.clientHeight || height;
      webgl.resize(canvasW, canvasH);

      const gl = canvas.getContext(`webgl2`);
      if (gl !== null) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      const done = webgl.drawBurst(current, width);
      if (done !== undefined) {
        setBurst(undefined);

        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    const raf = rafRef.current;

    return () => cancelAnimationFrame(raf);
  }, [burst, setBurst]);

  const onPointerDown: PointerEventHandler | undefined = disabled
    ? undefined
    : event => {
        const element = wrapperRef.current;
        if (element === null || event.button !== 0) {
          return;
        }
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setBurst({ id: singleBurstId, pointerId: event.pointerId, startTime: performance.now(), x, y });
        addWindowReleaseListener(event.pointerId);
      };

  const contentStyle =
    burst === undefined
      ? undefined
      : ({ "--splash-text-color": palette.textColor, "--splash-text-shadow": palette.textShadow } as CSSProperties);

  return {
    backgroundClassName,
    canvasLayerClassName,
    canvasRef,
    children,
    containerRef,
    contentStyle,
    onPointerDown,
    setWrapperRef,
  };
};
