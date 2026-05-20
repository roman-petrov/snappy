import type { MenuAction } from "@snappy/ui";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { t } from "../../locales";

export type FeedCardGenerationInput = {
  canRegenerate: boolean;
  empty: boolean;
  extraActions?: MenuAction[];
  onDelete?: () => void;
  onError?: (error: unknown) => void;
  onGenerated?: (value: string) => Promise<void> | void;
};

export const useFeedCardGeneration = ({
  canRegenerate,
  empty,
  extraActions = [],
  onDelete,
  onError,
  onGenerated,
}: FeedCardGenerationInput) => {
  const [busy, setBusy] = useState(false);
  const autoStarted = useRef(false);
  const onGeneratedRef = useRef(onGenerated);
  const onErrorRef = useRef(onError);
  onGeneratedRef.current = onGenerated;
  onErrorRef.current = onError;

  const regenerate = useCallback(() => {
    if (canRegenerate) {
      setBusy(true);
    }
  }, [canRegenerate]);

  useEffect(() => {
    if (!empty) {
      autoStarted.current = false;
    }
  }, [empty]);

  useEffect(() => {
    if (!busy && empty && canRegenerate && !autoStarted.current) {
      autoStarted.current = true;
      setBusy(true);
    }
  }, [busy, canRegenerate, empty]);

  const actions = useMemo<MenuAction[]>(() => {
    const base: MenuAction[] = [
      ...(canRegenerate
        ? [
            {
              disabled: busy,
              icon: `refresh`,
              key: `regenerate`,
              onClick: regenerate,
              tip: t(`feedCard.regenerate`),
            } satisfies MenuAction,
          ]
        : []),
      ...extraActions,
    ];

    return onDelete === undefined
      ? base
      : [...base, { color: `error`, icon: `delete`, key: `delete`, onClick: onDelete, tip: t(`feedCard.delete`) }];
  }, [busy, canRegenerate, extraActions, onDelete, regenerate]);

  return { actions, busy, onErrorRef, onGeneratedRef, setBusy };
};
