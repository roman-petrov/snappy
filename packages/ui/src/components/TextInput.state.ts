import { useRef, useState } from "react";

import type { TextInputProps } from "./TextInput";

import { Language } from "../core";
import { useIsMobile, useSpeechRecognition } from "../hooks";

export const useTextInputState = ({ afterMic, maxLines: maxLinesProp, onChange, ...textAreaRest }: TextInputProps) => {
  const { listening, speechSupported, start, stop } = useSpeechRecognition();
  const isMobile = useIsMobile();
  const maxLines = maxLinesProp ?? (isMobile ? 4 : 8);
  const [focused, setFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleRecording = () => {
    if (listening) {
      void stop();

      return;
    }

    start({ lang: Language.locale(), onText: onChange });
  };

  const micDisabled = textAreaRest.disabled === true || !speechSupported;

  return {
    afterMic,
    ...textAreaRest,
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
