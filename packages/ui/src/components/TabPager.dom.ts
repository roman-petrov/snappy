/* eslint-disable init-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable unicorn/no-null */
import type { CSSProperties, RefObject } from "react";

import { Dom } from "@snappy/browser";
import { _, type Ease } from "@snappy/core";
import { Vibrate } from "@snappy/platform";

import type { Color } from "../$";

import { TabPagerLogic } from "./TabPager.logic";

export type TabPagerTab = { color: Color; id: string; path: string };

const pointerOptions = { capture: true, passive: false } as const;

export type TabPagerDomConfig = {
  contentRef: RefObject<HTMLElement | null>;
  setBarOffset: (offset: number | undefined) => void;
  setSettling: (settling: boolean) => void;
};

export type TabPagerFrame = {
  barIndex: number;
  index: number;
  indicatorTints: CSSProperties[];
  panelTints: CSSProperties[];
};

export type TabPagerFrameInput = {
  activeId?: string;
  barOffset: number | undefined;
  ease: Ease;
  items: TabPagerTab[];
  navigate: (path: string) => void;
  pathname: string;
  touch: boolean;
};

export const TabPagerDom = ({ contentRef, setBarOffset, setSettling }: TabPagerDomConfig) => {
  const trackRef: RefObject<HTMLDivElement | null> = { current: null };
  let ease: Ease = ratio => ratio;
  let items: TabPagerTab[] = [];
  let navigate: (path: string) => void = _.noop;
  let touch = false;
  let lastTabId: string | undefined;
  let width = 0;
  let dragIndex = 0;
  let offset = 0;
  let lock: ReturnType<typeof TabPagerLogic.axisLock> = `pending`;
  let origin = { x: 0, y: 0 };
  let pointerId: number | undefined;
  let velocitySample = { sample: 0, time: 0, value: 0 };
  let frameId: number | undefined;
  let dragging = false;
  let settling = false;
  let currentIndex = 0;
  const count = () => items.length;
  const clearBar = () => setBarOffset(undefined);
  const translate = (index: number, shift = 0) => TabPagerLogic.fromDrag(index, shift, width, count());

  const syncWidth = () => {
    width = contentRef.current?.clientWidth ?? 0;
  };

  const syncTrack = (translateX: number) => {
    if (trackRef.current !== null) {
      trackRef.current.style.transform = touch ? `translateX(${_.px(translateX)})` : ``;
    }
  };

  const sync = (translateX: number) => {
    syncTrack(translateX);
    setBarOffset(TabPagerLogic.fromTranslate(translateX, width, count()));
  };

  const cancelFrame = () => {
    if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
  };

  const resetLock = () => {
    pointerId = undefined;
    lock = `pending`;
  };

  const navigateTo = (target: number) => {
    if (target === currentIndex) {
      return;
    }

    const path = items[target]?.path;

    if (path !== undefined) {
      Vibrate.trigger(`confirm`);
      navigate(path);
    }
  };

  const finish = (target: number) => {
    cancelFrame();
    settling = false;
    offset = 0;
    dragging = false;
    resetLock();
    setSettling(false);
    touch ? (sync(translate(target)), navigateTo(target)) : clearBar();
  };

  const settle = (target: number) => {
    syncWidth();
    const total = count();
    const startProgress = TabPagerLogic.fromDragProgress(dragIndex, offset, width, total);
    const endProgress = TabPagerLogic.fromIndex(target, total);

    if (width === 0 || !TabPagerLogic.shouldSettle(startProgress, endProgress)) {
      finish(target);

      return;
    }

    if (!touch) {
      navigateTo(target);
    }

    cancelFrame();
    settling = true;
    setSettling(true);
    const startTime = performance.now();

    const step = (now: number) => {
      const ratio = TabPagerLogic.settleRatio(now, startTime);
      sync(TabPagerLogic.toTranslate(_.lerp(startProgress, endProgress, ease(ratio)), width, total));
      ratio < 1 ? (frameId = requestAnimationFrame(step)) : finish(target);
    };

    frameId = requestAnimationFrame(step);
  };

  const frame = ({
    activeId,
    barOffset,
    ease: nextEase,
    items: nextItems,
    navigate: nextNavigate,
    pathname,
    touch: nextTouch,
  }: TabPagerFrameInput): TabPagerFrame => {
    ease = nextEase;
    items = nextItems;
    navigate = nextNavigate;
    touch = nextTouch;

    const resolvedActiveId = activeId ?? items.find(item => item.path === pathname)?.id;
    lastTabId = resolvedActiveId ?? lastTabId;
    currentIndex = TabPagerLogic.routeIndex(items, resolvedActiveId, lastTabId);

    const { barIndex, indicatorTints, panelTints } = TabPagerLogic.chrome(
      items.map(item => item.color),
      barOffset,
      currentIndex,
      count(),
    );

    return { barIndex, index: currentIndex, indicatorTints, panelTints };
  };

  const layout = (slides: boolean) => {
    if (!slides || dragging || settling) {
      return;
    }

    syncWidth();
    syncTrack(translate(currentIndex));
    clearBar();
  };

  const select = (id: string) => {
    const target = items.findIndex(item => item.id === id);

    if (target === -1 || dragging || settling || target === currentIndex) {
      return;
    }

    syncWidth();
    dragIndex = currentIndex;
    offset = 0;
    settle(target);
  };

  const onDown = (event: PointerEvent) => {
    const root = contentRef.current;

    if (root === null || settling || event.button !== 0) {
      return;
    }

    cancelFrame();
    syncWidth();
    dragIndex = currentIndex;
    lock = `pending`;
    const { clientX, clientY, pointerId: eventPointerId, timeStamp: timestamp } = event;
    origin = { x: clientX, y: clientY };
    pointerId = eventPointerId;
    velocitySample = { sample: clientX, time: timestamp, value: 0 };
    root.setPointerCapture(eventPointerId);
  };

  const onMove = (event: PointerEvent) => {
    const root = contentRef.current;

    if (root === null || pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;

    if (lock === `pending`) {
      lock = TabPagerLogic.axisLock(dx, dy);

      if (lock === `vertical`) {
        root.releasePointerCapture(event.pointerId);
        pointerId = undefined;

        return;
      }

      if (lock === `pending`) {
        return;
      }

      dragging = true;
    }

    if (lock !== `horizontal`) {
      return;
    }

    event.preventDefault();
    velocitySample = TabPagerLogic.velocity(velocitySample, event.clientX, event.timeStamp);
    offset = TabPagerLogic.clampOffset(dx, width, dragIndex, count());
    sync(translate(dragIndex, offset));
  };

  const onUp = (event: PointerEvent) => {
    const root = contentRef.current;

    if (root === null || pointerId !== event.pointerId) {
      return;
    }

    root.releasePointerCapture(event.pointerId);

    if (lock !== `horizontal`) {
      resetLock();

      return;
    }

    settle(TabPagerLogic.snapTarget(dragIndex, offset, width, count(), velocitySample.value));
  };

  const onCancel = () => {
    if (lock === `horizontal`) {
      settle(dragIndex);
    }

    resetLock();
  };

  const pointer = () => {
    const root = contentRef.current;

    return root === null
      ? _.noop
      : _.singleAction([
          Dom.watchSize(root, syncWidth),
          Dom.subscribe(root, `pointerdown`, onDown, pointerOptions),
          Dom.subscribe(root, `pointermove`, onMove, pointerOptions),
          Dom.subscribe(root, `pointerup`, onUp, pointerOptions),
          Dom.subscribe(root, `pointercancel`, onCancel, pointerOptions),
          cancelFrame,
          clearBar,
        ]);
  };

  return { frame, layout, pointer, select, trackRef };
};

export type TabPagerDom = ReturnType<typeof TabPagerDom>;
