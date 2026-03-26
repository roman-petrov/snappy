import { useState } from "react";

import type { TextComposerProps } from "./TextComposer";

export const useTextComposerState = ({ loading, text, ...rest }: TextComposerProps) => {
  const [showSettings, setShowSettings] = useState(true);
  const hasDraft = text.trim() !== ``;
  const toggleSettings = () => setShowSettings(value => !value);

  return { ...rest, hasDraft, loading, showSettings, text, toggleSettings };
};
