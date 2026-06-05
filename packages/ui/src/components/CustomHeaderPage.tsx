import type { ReactNode } from "react";

import { useCustomHeaderPageState } from "./CustomHeaderPage.state";
import { CustomHeaderPageView } from "./CustomHeaderPage.view";

export type CustomHeaderPageProps = { children: ReactNode; header?: ReactNode };

export const CustomHeaderPage = (props: CustomHeaderPageProps) => (
  <CustomHeaderPageView {...useCustomHeaderPageState(props)} />
);
