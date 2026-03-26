import { useIsMobile } from "@snappy/ui";
import { useState } from "react";

import type { TextComposerProps } from "./TextComposer";

export const useTextComposerState = ({ loading, text, ...rest }: TextComposerProps) => {
  const [showSettings, setShowSettings] = useState(true);
  const hasDraft = text.trim() !== ``;
  const maxLines = useIsMobile() ? 4 : 8;
  const toggleSettings = () => setShowSettings(value => !value);

  return { ...rest, hasDraft, loading, maxLines, showSettings, text, toggleSettings };
};
