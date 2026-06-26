import type { RouterPageState } from "@snappy/router";

import { Flip, type Flip as FlipMotion } from "@snappy/motion";
import { useStoreValue } from "@snappy/store";
import { useEffect, useRef, useState } from "react";

import type { RouteStageFlipProps } from "./RouteStageFlip";

import { RouteMotion } from "../core";
import { useRouter } from "../hooks/useRouter";
import { useRouteStage } from "../hooks/useRouteStage";

export const useRouteStageFlipState = ({ children, page }: RouteStageFlipProps) => {
  const {
    contentRef,
    insets,
    motion: { setFlipAnimating },
  } = useRouteStage();

  const { $page } = useRouter();
  const state = useStoreValue($page);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [outgoing, setOutgoing] = useState<RouterPageState | undefined>();
  const hostRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<FlipMotion>(undefined);

  flipRef.current ??= Flip({ host: inRef, onAnimating: setFlipAnimating, outgoing: outRef, root: hostRef });
  const flip = flipRef.current;

  useEffect(() => RouteMotion.bindFlip(flip, () => stateRef.current, setOutgoing), [flip]);

  return { children, contentRef, hostRef, inRef, outgoing, outRef, page, scrollPaddingBottom: insets.shell.scrollPad };
};
