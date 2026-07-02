import type { ReactNode } from "react";

import { useAppSiteState } from "./AppSite.state";
import { AppSiteView } from "./AppSite.view";

export type AppSiteProps = { children?: ReactNode; header?: ReactNode };

export const AppSite = (props: AppSiteProps) => <AppSiteView {...useAppSiteState(props)} />;
