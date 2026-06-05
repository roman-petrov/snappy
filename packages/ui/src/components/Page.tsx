import type { ReactNode } from "react";

import { CustomHeaderPage } from "./CustomHeaderPage";
import { PageHeader } from "./PageHeader";

export type PageProps = { back?: boolean; children: ReactNode; title?: string };

export const Page = ({ back = false, children, title }: PageProps) => (
  <CustomHeaderPage
    children={children}
    header={title === undefined && !back ? undefined : <PageHeader back={back} title={title} />}
  />
);
