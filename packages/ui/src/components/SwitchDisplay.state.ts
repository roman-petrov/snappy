import { Vibrate } from "@snappy/platform";
import { useEffect, useRef } from "react";

import type { SwitchDisplayProps } from "./SwitchDisplay";

export const useSwitchDisplayState = ({ checked = false, disabled = false }: SwitchDisplayProps) => {
  const skipHaptic = useRef(true);

  useEffect(() => {
    if (skipHaptic.current) {
      skipHaptic.current = false;

      return;
    }
    if (disabled) {
      return;
    }
    Vibrate.trigger(checked ? `toggleOn` : `toggleOff`);
  }, [checked, disabled]);

  return { checked, disabled };
};
