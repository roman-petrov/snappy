import type { ReactNode } from "react";

import { createContext } from "react";

export const ContextMenuContext = createContext<
  | undefined
  | {
      close: () => void;
      toggle: (args: {
        content: ReactNode;
        point: { x: number; y: number };
        source: { id: string; kind?: string };
      }) => void;
    }
>(undefined);
