import type { Go } from "@snappy/router";

import { useRouter } from "./useRouter";

export const useRouterGo = (): Go => useRouter().go;
