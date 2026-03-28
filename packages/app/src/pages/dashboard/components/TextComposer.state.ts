import { Locale, useIsMobile, useSpeechRecognition } from "@snappy/ui";
import { useCallback, useRef, useState } from "react";

import type { TextComposerProps } from "./TextComposer";

export const useTextComposerState = ({ loading, onSubmit, onTextChange, text, ...rest }: TextComposerProps) => {
  const { listening, speechSupported, start, stop } = useSpeechRecognition();
  const hasDraft = text.trim() !== ``;
  const maxLines = useIsMobile() ? 4 : 8;
  const [focused, setFocused] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleRecording = useCallback(() => {
    if (listening) {
      void stop();

      return;
    }

    start({ lang: Locale.effective(), onText: onTextChange });
  }, [onTextChange, listening, start, stop]);

  const process = useCallback(() => {
    if (hasDraft) {
      onSubmit();
    }
  }, [hasDraft, onSubmit]);

  const processLoading = loading;
  const micDisabled = loading || !speechSupported;

  return {
    ...rest,
    focused,
    hasDraft,
    listening,
    loading,
    maxLines,
    micDisabled,
    onTextChange,
    process,
    processLoading,
    setInputBlurred: () => setFocused(false),
    setInputFocused: () => setFocused(true),
    settingsVisible,
    speechSupported,
    text,
    textAreaRef,
    toggleRecording,
    toggleSettings: () => setSettingsVisible(value => !value),
  };
};
