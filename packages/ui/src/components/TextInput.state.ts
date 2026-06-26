import { Mic } from "lucide-react";
import { useRef, useState } from "react";

import type { IconButtonProps } from "./IconButton";
import type { TextAreaProps } from "./TextArea";
import type { TextInputProps } from "./TextInput";

import { Language } from "../core";
import { useIsMobile, useSpeechRecognition } from "../hooks";

export const useTextInputState = ({
  afterMic,
  glass = false,
  maxLines: maxLinesProp,
  onChange,
  ...textAreaRest
}: TextInputProps) => {
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

  const setInputBlurred = () => setFocused(false);
  const setInputFocused = () => setFocused(true);
  const active = focused || listening;

  const textArea: TextAreaProps = {
    ...textAreaRest,
    collapsed: !active,
    maxLines,
    onBlur: setInputBlurred,
    onChange,
    onFocus: setInputFocused,
    readOnly: listening,
    ref: textAreaRef,
  };

  const micButton: Omit<IconButtonProps, `tip`> = {
    color: listening ? `error` : undefined,
    disabled: textAreaRest.disabled === true || !speechSupported,
    icon: Mic,
    keepFocus: true,
    onClick: toggleRecording,
  };

  return { afterMic, glass, listening, micButton, speechSupported, textArea };
};
