import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { TextComposerProps } from "./TextComposer";

export const useTextComposerState = ({ loading, showResult, text, ...rest }: TextComposerProps) => {
  const [editing, setEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const wasLoading = useRef(false);

  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!showResult || !editing || node === null) {
      return;
    }
    const end = node.value.length;
    node.focus();
    node.setSelectionRange(end, end);
  }, [editing, showResult]);

  useEffect(() => {
    if (!showResult) {
      setEditing(false);
      wasLoading.current = loading;

      return;
    }
    if (loading) {
      setEditing(false);
    }
    if (wasLoading.current && !loading) {
      setEditing(false);
    }
    wasLoading.current = loading;
  }, [loading, showResult]);

  const hasDraft = text.trim() !== ``;
  const showBlur = showResult && !editing;
  const expand = () => setEditing(true);
  const toggleSettings = () => setShowSettings(value => !value);

  return { ...rest, expand, hasDraft, loading, showBlur, showResult, showSettings, text, textareaRef, toggleSettings };
};
