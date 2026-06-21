import type { Action } from "@snappy/core";

import { createContext, type RefCallback, type RefObject } from "react";

import type { RouteLayer } from "./RouteStack";

export type ChromeScope = `page` | `shell`;

export type CoverPhase = { closing: boolean; entering: boolean };

export type RouteStageMotionValue = {
  flipAnimating: boolean;
  phase: CoverPhase;
  setFlipAnimating: (animating: boolean) => void;
  setPhase: (phase: CoverPhase) => void;
};

export type RouteStageValue = {
  contentRef: RefObject<HTMLDivElement | null>;
  insets: StageInsetsValue;
  keyboard: boolean;
  layer: RouteLayer | undefined;
  motion: RouteStageMotionValue;
  pageDock: HTMLDivElement | undefined;
  pageDockRef: RefCallback<HTMLDivElement>;
  registerChrome: (scope: ChromeScope, height: number) => Action;
  shellDock: HTMLDivElement | undefined;
  shellDockRef: RefCallback<HTMLDivElement>;
  track?: TrackValue;
  underlay: RouteUnderlay;
};

export type RouteUnderlay = { contentDimmed: boolean; shellPassive: boolean };

export type StageInsetsValue = { dockPad: string; page: LaneInsets; shell: LaneInsets };

export type TrackItem = { id: string; path: string };

export type TrackValue = { animating: boolean; index: number; pageIndex: number };

type LaneInsets = { fadeMinHeight: string; scrollPad: string };

export const RouteStageContext = createContext<RouteStageValue | undefined>(undefined);
