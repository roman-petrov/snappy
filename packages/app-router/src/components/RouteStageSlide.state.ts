import { useHasTouchInput } from "@snappy/hooks";
import { Slide, type Slide as SlideMotion } from "@snappy/motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { RouteStageSlideProps } from "./RouteStageSlide";

import { RouteMotion, type TrackValue } from "../core";
import { useRouter } from "../hooks/useRouter";
import { useRouterGo } from "../hooks/useRouterGo";
import { useRouterPath } from "../hooks/useRouterPath";
import { useRouteStage } from "../hooks/useRouteStage";

export const useRouteStageSlideState = ({ children, items }: RouteStageSlideProps) => {
  const base = useRouteStage();
  const { contentRef, insets, layer, underlay } = base;
  const { pattern } = useRouter();
  const touch = useHasTouchInput();
  const go = useRouterGo();
  const path = useRouterPath();
  const laneRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<SlideMotion>(undefined);
  const lastIndexRef = useRef<number | undefined>(undefined);
  const frameRef = useRef({ index: 0, items });
  const [livePageIndex, setLivePageIndex] = useState<number | undefined>();

  const trackAt = useCallback(
    (routePattern: string) => {
      const slot = items.findIndex(item => pattern(item.path) === routePattern);

      return slot === -1 ? undefined : slot;
    },
    [items, pattern],
  );

  const matched = trackAt(pattern(path));

  if (matched !== undefined) {
    lastIndexRef.current = matched;
  }

  const index = matched ?? lastIndexRef.current ?? trackAt(`/`) ?? 0;

  frameRef.current = { index, items };

  motionRef.current ??= Slide({
    count: () => frameRef.current.items.length,
    index: () => frameRef.current.index,
    onIndex: target => {
      const targetPath = frameRef.current.items[target]?.path;

      if (targetPath !== undefined) {
        void go(targetPath);
      }
    },
    onPageIndex: setLivePageIndex,
    root: contentRef,
    track: laneRef,
  });

  const motion = motionRef.current;
  motion.frame(touch);

  useEffect(() => RouteMotion.bindSlide(motion, trackAt), [motion, trackAt]);

  useLayoutEffect(() => {
    motion.layout();
  }, [index, items, motion, touch]);

  useEffect(() => (layer === undefined && touch ? motion.pointer() : undefined), [layer, motion, touch]);

  const pageIndex = livePageIndex ?? index;
  const track: TrackValue = { animating: livePageIndex !== undefined, index, pageIndex };
  const stage = { ...base, track };

  const lanes = {
    contentDimmed: underlay.contentDimmed,
    contentRef,
    items,
    laneRef,
    scrollPaddingBottom: insets.shell.scrollPad,
  };

  return { children, lanes, stage };
};
