import { useEffect, useState } from "preact/hooks";

export const useSyncExternalStore = <T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T => {
  void getServerSnapshot;
  const [snapshot, setSnapshot] = useState(getSnapshot);

  useEffect(() => subscribe(() => setSnapshot(getSnapshot())), [subscribe, getSnapshot]);

  return snapshot;
};
