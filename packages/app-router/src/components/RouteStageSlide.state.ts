import { useHasTouchInput } from "@snappy/hooks";
import { Slide, type Slide as SlideMotion } from "@snappy/motion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import type { RouteStageSlideProps } from "./RouteStageSlide";

import { RouteMotion, type TrackListener, type TrackLive, type TrackValue } from "../core";
import { useRouter } from "../hooks/useRouter";
import { useRouterGo } from "../hooks/useRouterGo";
import { useRouterPath } from "../hooks/useRouterPath";
import { useRouteStage } from "../hooks/useRouteStage";
import { useTrackMotion } from "../hooks/useTrackMotion";

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
  const itemsRef = useRef(items);
  const liveRef = useRef<{ listeners: Set<TrackListener> }>({ listeners: new Set() });
  const liveApi = useRef<TrackLive>(undefined);

  liveApi.current ??= {
    subscribe: listener => {
      liveRef.current.listeners.add(listener);

      return () => {
        liveRef.current.listeners.delete(listener);
      };
    },
  };

  const emit = useCallback((value: number, moving: boolean) => {
    for (const listener of liveRef.current.listeners) {
      listener(value, moving);
    }
  }, []);

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

  itemsRef.current = items;

  motionRef.current ??= Slide({
    count: () => itemsRef.current.length,
    index,
    onIndex: target => {
      const targetPath = itemsRef.current[target]?.path;

      if (targetPath !== undefined) {
        void go(targetPath);
      }
    },
    onPageIndex: emit,
    root: contentRef,
    track: laneRef,
  });

  const motion = motionRef.current;
  motion.frame(touch);

  useEffect(() => RouteMotion.bindSlide(motion, trackAt), [motion, trackAt]);

  useLayoutEffect(() => {
    if (matched !== undefined) {
      motion.sync(matched);
    }

    motion.layout();
  }, [matched, items, motion, touch]);

  useTrackMotion(motion, layer === undefined);

  const track: TrackValue = { index, live: liveApi.current };
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
