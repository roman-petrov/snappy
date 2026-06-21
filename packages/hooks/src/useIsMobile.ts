import { Viewport } from "./core";
import { useMediaQuery } from "./useMediaQuery";

export const useIsMobile = () => useMediaQuery(Viewport.query());
