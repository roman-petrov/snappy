import { _ } from "@snappy/core";
import { Bridge } from "@snappy/platform";
import { useLayoutEffect } from "react";

export const useExternalReady = () => {
  useLayoutEffect(() => {
    if (!Bridge.available) {
      return _.noop;
    }
    let outer = 0;
    let inner = 0;
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => Bridge.externalReady());
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);
};
