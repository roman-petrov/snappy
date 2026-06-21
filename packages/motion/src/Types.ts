import type { Gesture } from "@snappy/core";

export type DomRef<T extends HTMLElement = HTMLElement> = { current: null | T };

export type TrackReleaseSnap = { gesture: Gesture; stay: boolean };
