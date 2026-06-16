import type { ReactNode } from "react";

import { usePageState } from "./Page.state";
import { PageView } from "./Page.view";

export type PageProps = {
  back?: boolean;
  children: ReactNode;
  header?: ReactNode;
  title?: ReactNode;
  trailing?: ReactNode;
};

export const Page = (props: PageProps) => <PageView {...usePageState(props)} />;
