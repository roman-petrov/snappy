import { Clipboard } from "@snappy/browser";
import { _, Timer } from "@snappy/core";
import { useCallback, useState } from "react";

import type { PresetCardProps } from "./PresetCard";

export const usePresetCardState = ({ onPick, preset, selected, variant }: PresetCardProps) => {
  const [copied, setCopied] = useState(false);

  const requestCopy = useCallback((): void => {
    if (variant !== `grid` || preset.prompt === ``) {
      return;
    }
    void (async () => {
      try {
        await Clipboard.copy(preset.prompt);
        setCopied(true);
        Timer.timeout(() => {
          setCopied(false);
        }, 2 * _.second);
      } catch {
        /* Ignore */
      }
    })();
  }, [preset.prompt, variant]);

  return variant === `free`
    ? { onPick, preset, selected, variant: `free` as const }
    : { copied, onPick, preset, requestCopy, selected, variant: `grid` as const };
};
