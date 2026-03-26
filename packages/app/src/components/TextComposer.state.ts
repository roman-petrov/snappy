import { useState } from "react";

import type { TextComposerProps } from "./TextComposer";

export const useTextComposerState = ({ loading, text, ...rest }: TextComposerProps) => {
  const [focused, setFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const hasDraft = text.trim() !== ``;
  const blur = () => setFocused(false);
  const focus = () => setFocused(true);
  const toggleSettings = () => setShowSettings(value => !value);

  return { ...rest, blur, focus, focused, hasDraft, loading, showSettings, text, toggleSettings };
};
