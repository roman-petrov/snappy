import { _ } from "@snappy/core";

import { ThemeVar } from "../core";
import { useMediaQuery } from "./useMediaQuery";

export const useIsMobile = () => useMediaQuery(`(max-width: ${_.px(ThemeVar.mobileBreakpoint())})`);
