import { useRequiredContext } from "@snappy/hooks";

import { RouteStageContext } from "../core";

export const useTrack = () => {
  const { track } = useRequiredContext(RouteStageContext, `useTrack`, `RouteStageContext`);

  if (track === undefined) {
    throw new Error(`useTrack must be used within a RouteStage slide track`);
  }

  return track;
};
