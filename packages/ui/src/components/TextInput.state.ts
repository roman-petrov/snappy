import { useCallback, useRef, useState } from "react";

import type { TextInputProps } from "./TextInput";

import { Locale } from "../core";
import { useIsMobile, useSpeechRecognition } from "../hooks";

export const useTextInputState = ({ maxLines: maxLinesProp, onChange, ...rest }: TextInputProps) => {
  const { listening, speechSupported, start, stop } = useSpeechRecognition();
  const isMobile = useIsMobile();
  const maxLines = maxLinesProp ?? (isMobile ? 4 : 8);
  const [focused, setFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleRecording = useCallback(() => {
    if (listening) {
      void stop();

      return;
    }

    start({ lang: Locale.effective(), onText: onChange });
  }, [onChange, listening, start, stop]);

  const micDisabled = rest.disabled === true || !speechSupported;

  return {
    ...rest,
    focused,
    listening,
    maxLines,
    micDisabled,
    onChange,
    setInputBlurred: () => setFocused(false),
    setInputFocused: () => setFocused(true),
    speechSupported,
    textAreaRef,
    toggleRecording,
  };
};
