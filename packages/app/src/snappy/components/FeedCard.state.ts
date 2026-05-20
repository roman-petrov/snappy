import type { MenuAction } from "@snappy/ui";

import { type TransitionEventHandler, useCallback, useMemo, useRef, useState } from "react";

import type { FeedCardProps } from "./FeedCard";

export const useFeedCardState = ({ actions = [], onRemove, ...rest }: FeedCardProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);
  const removedRef = useRef(false);

  const startExit = useCallback(() => {
    setExiting(true);
  }, []);

  const menuActions = useMemo<MenuAction[]>(
    () => actions.map(action => (action.key === `delete` ? { ...action, onClick: startExit } : action)),
    [actions, startExit],
  );

  const onDissolveEnd: TransitionEventHandler<HTMLDivElement> = useCallback(
    event => {
      if (event.target !== event.currentTarget || !exiting || removedRef.current || event.propertyName !== `opacity`) {
        return;
      }
      removedRef.current = true;
      void Promise.resolve(onRemove());
    },
    [exiting, onRemove],
  );

  return { ...rest, actions: menuActions, bodyRef, exiting, onDissolveEnd };
};
