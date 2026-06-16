import type { ReactNode } from "react";

import { usePageChromeState } from "./PageChrome.state";
import { PageChromeView } from "./PageChrome.view";

export type PageChromeProps = {
  active?: boolean;
  children?: ReactNode;
  cn?: string;
  fixed?: boolean;
  role: `page` | `shell`;
};

export const PageChrome = (props: PageChromeProps) => <PageChromeView {...usePageChromeState(props)} />;
