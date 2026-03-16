/* eslint-disable react-hooks/exhaustive-deps */
import { type DependencyList, useEffect } from "react";

export const useAsyncEffect = (fn: () => Promise<void>, deps: DependencyList) => {
  useEffect(() => {
    void fn();
  }, deps);
};
