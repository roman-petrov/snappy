import { usePageHeaderState } from "./PageHeader.state";
import { PageHeaderView } from "./PageHeader.view";

export type PageHeaderProps = { back?: boolean; title?: string };

export const PageHeader = (props: PageHeaderProps) => <PageHeaderView {...usePageHeaderState(props)} />;
