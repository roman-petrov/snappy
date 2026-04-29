import type { ReactNode, RefObject } from "react";

import { Card } from "@snappy/ui";

import styles from "./FeedPanel.module.scss";

export type FeedPanelProps = {
  active?: boolean;
  bodyRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  cn?: string;
};

export const FeedPanel = ({ active = false, bodyRef, children, cn }: FeedPanelProps) => (
  <Card active={active} cn={cn}>
    <div children={children} className={styles.body} ref={bodyRef} />
  </Card>
);
