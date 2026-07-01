import { useHasTouchInput } from "@snappy/hooks";
import { useEffect } from "react";

type TrackMotion = { pointer: () => () => void; resize: () => () => void };

export const useTrackMotion = (motion: TrackMotion, pointer: boolean) => {
  const touch = useHasTouchInput();

  useEffect(() => {
    const unbindResize = motion.resize();
    const unbindPointer = pointer && touch ? motion.pointer() : undefined;

    return () => {
      unbindResize();
      unbindPointer?.();
    };
  }, [motion, pointer, touch]);
};
