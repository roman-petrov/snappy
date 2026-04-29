import type { ReactNode } from "react";

import { useContextMenuHostState } from "./ContextMenuHost.state";
import { ContextMenuHostView } from "./ContextMenuHost.view";

export type ContextMenuHostProps = { children: ReactNode };

export const ContextMenuHost = ({ children }: ContextMenuHostProps) => (
  <ContextMenuHostView {...useContextMenuHostState({ children })} />
);
