import type { ReactNode } from "react";

import { useProtectState } from "./Protect.state";
import { ProtectView } from "./Protect.view";

export type ProtectProps = { children: ReactNode };

export const Protect = (props: ProtectProps) => <ProtectView {...props} {...useProtectState()} />;
