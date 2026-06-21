import { _ } from "@snappy/core";
import { createPortal } from "react-dom";

import type { usePageChromeState } from "./PageChrome.state";

import { ContentColumn } from "./ContentColumn";
import styles from "./PageChrome.module.scss";

export type PageChromeViewProps = ReturnType<typeof usePageChromeState>;

export const PageChromeView = ({ active, children, cn, dockPad, hidden, passive, ref, target }: PageChromeViewProps) =>
  hidden || target === undefined
    ? undefined
    : createPortal(
        <div
          className={_.cn(styles.dock, passive && styles.dockPassive, cn)}
          style={{ paddingBottom: active ? dockPad : undefined }}
        >
          <ContentColumn cn={styles.content} ref={ref}>
            {children}
          </ContentColumn>
        </div>,
        target,
      );
