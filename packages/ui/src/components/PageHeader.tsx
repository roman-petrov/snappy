import type { ReactNode } from "react";

import { usePageHeaderState } from "./PageHeader.state";
import { PageHeaderView } from "./PageHeader.view";

export type PageHeaderProps = { back?: boolean; title?: ReactNode; trailing?: ReactNode };

export const PageHeader = (props: PageHeaderProps) => <PageHeaderView {...usePageHeaderState(props)} />;
