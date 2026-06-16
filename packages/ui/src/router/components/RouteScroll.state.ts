import type { RouteScrollProps } from "./RouteScroll";

import { useRouteStage } from "../hooks";

export const useRouteScrollState = ({ dimmed = false, scroll = true, ...rest }: RouteScrollProps) => {
  const { scrollPaddingBottom, scrollSafeArea } = useRouteStage();
  const paddingBottom = scroll ? scrollPaddingBottom : undefined;
  const safeArea = scroll && scrollSafeArea;

  return { ...rest, dimmed, paddingBottom, safeArea, scroll };
};
