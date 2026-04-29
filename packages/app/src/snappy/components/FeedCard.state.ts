import { useRef } from "react";

import type { FeedCardProps } from "./FeedCard";

export const useFeedCardState = (props: FeedCardProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  return { ...props, bodyRef };
};
