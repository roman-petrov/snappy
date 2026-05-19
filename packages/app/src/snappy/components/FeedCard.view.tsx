import { ContextMenu, Menu } from "@snappy/ui";

import type { useFeedCardState } from "./FeedCard.state";

import { FeedPanel } from "./FeedPanel";

export type FeedCardViewProps = ReturnType<typeof useFeedCardState>;

export const FeedCardView = ({ actions, bodyRef, children }: FeedCardViewProps) => (
  <>
    <FeedPanel bodyRef={bodyRef}>{children}</FeedPanel>
    <ContextMenu elementRef={bodyRef}>{close => <Menu actions={actions ?? []} close={close} />}</ContextMenu>
  </>
);
