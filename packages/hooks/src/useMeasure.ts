import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { type RefObject, useLayoutEffect, useState } from "react";

type Measure = { height: number; width: number };

type MeasureTarget = HTMLElement | null | RefObject<HTMLElement | null> | undefined;

const empty: Measure = { height: 0, width: 0 };

const elementOf = (target: MeasureTarget) => {
  if (target === null || target === undefined) {
    return undefined;
  }

  return `current` in target ? (target.current ?? undefined) : target;
};

export const useMeasure = (target: MeasureTarget, active = true): Measure => {
  const [measure, setMeasure] = useState(empty);

  useLayoutEffect(() => {
    const element = active ? elementOf(target) : undefined;

    if (!active || element === undefined) {
      setMeasure(empty);

      return _.noop;
    }

    return Dom.watchSize(element, setMeasure);
  }, [active, target]);

  return active ? measure : empty;
};
