import { Vibrate } from "@snappy/platform";
import { useEffect, useRef } from "react";

export const useToggleHaptic = (checked: boolean, disabled = false) => {
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
};
