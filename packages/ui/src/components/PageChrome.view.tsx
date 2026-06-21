import { _ } from "@snappy/core";

import type { usePageChromeState } from "./PageChrome.state";

import styles from "./PageChrome.module.scss";

export type PageChromeViewProps = ReturnType<typeof usePageChromeState>;

export const PageChromeView = ({ children, cn, fixed, hidden, passive, ref }: PageChromeViewProps) =>
  hidden ? undefined : (
    <div className={_.cn(fixed && styles.dock, passive && styles.dockPassive, cn)} ref={ref}>
      {children}
    </div>
  );
