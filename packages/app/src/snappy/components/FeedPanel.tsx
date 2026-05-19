import type { ReactNode, RefObject } from "react";

import { Card } from "@snappy/ui";

import styles from "./FeedPanel.module.scss";

export type FeedPanelProps = {
  bodyRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  cn?: string;
};

export const FeedPanel = ({ bodyRef, children, cn }: FeedPanelProps) => (
  <Card cn={cn}>
    <div children={children} className={styles.body} ref={bodyRef} />
  </Card>
);
