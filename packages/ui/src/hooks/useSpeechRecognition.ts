import { Speech, type SpeechRecognizerOptions, type SpeechRecognizerStop } from "@snappy/browser";
import { useCallback, useRef, useState } from "react";

import { Vibrate } from "../core/Vibrate";
import { useUnmount } from "./useUnmount";

export const useSpeechRecognition = () => {
  const [listening, setListening] = useState(false);
  const stopRef = useRef<SpeechRecognizerStop | undefined>(undefined);
  const speechSupported = Speech.recognize !== undefined;

  const stop = useCallback(async () => {
    const stopCurrent = stopRef.current;
    stopRef.current = undefined;
    setListening(false);
    if (stopCurrent !== undefined) {
      await stopCurrent();
    }
  }, []);

  const start = useCallback(
    (options: SpeechRecognizerOptions) => {
      if (!speechSupported || listening) {
        return false;
      }
      const { recognize } = Speech;
      if (recognize === undefined) {
        return false;
      }
      setListening(true);
      stopRef.current = recognize({
        ...options,
        onText: text => {
          Vibrate.trigger(`clockTick`);
          options.onText(text);
        },
      });

      return true;
    },
    [listening, speechSupported],
  );

  useUnmount(stop);

  return { listening, speechSupported, start, stop };
};
