import type { ReactNode } from "react";

import { BusyShimmerOverlay, Button } from "@snappy/ui";

import { t } from "../../../core";
import styles from "./FeedCard.module.scss";

export type FeedCardProps = {
  busy?: boolean;
  children: ReactNode;
  onCopy: () => void;
  onRegenerate: () => Promise<void> | void;
};

export const FeedCard = ({ busy = false, children, onCopy, onRegenerate }: FeedCardProps) => (
  <div className={styles.root}>
    <div className={styles.body}>
      {children}
      {busy ? <BusyShimmerOverlay /> : undefined}
    </div>
    <div className={styles.actions}>
      <Button onClick={onCopy} text={t(`dashboard.copy`)} />
      <Button disabled={busy} onClick={onRegenerate} text={t(`chat.feed.regenerate`)} />
    </div>
  </div>
);
