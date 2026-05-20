import { _ } from "@snappy/core";
import { ContextMenu, Menu } from "@snappy/ui";

import type { useFeedCardState } from "./FeedCard.state";

import styles from "./FeedCard.module.scss";
import { FeedPanel } from "./FeedPanel";

export type FeedCardViewProps = ReturnType<typeof useFeedCardState>;

export const FeedCardView = ({ actions, bodyRef, children, exiting, onDissolveEnd }: FeedCardViewProps) => (
  <>
    <div className={_.cn(styles.shell, exiting ? styles.shellExiting : undefined)}>
      <div className={styles.shellInner} onTransitionEnd={onDissolveEnd}>
        <FeedPanel bodyRef={bodyRef}>{children}</FeedPanel>
      </div>
    </div>
    <ContextMenu elementRef={bodyRef}>{close => <Menu actions={actions} close={close} />}</ContextMenu>
  </>
);
