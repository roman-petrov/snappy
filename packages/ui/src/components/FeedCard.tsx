import type { ReactNode } from "react";

import { t } from "../locales";
import { BusyShimmerOverlay } from "./BusyShimmerOverlay";
import { Button } from "./Button";
import styles from "./FeedCard.module.scss";

export type FeedCardProps = {
  busy?: boolean;
  children: ReactNode;
  onCopy?: () => void;
  onRegenerate?: () => Promise<void> | void;
};

export const FeedCard = ({ busy = false, children, onCopy, onRegenerate }: FeedCardProps) => (
  <div className={styles.root}>
    <div className={styles.body}>
      {children}
      {busy ? <BusyShimmerOverlay /> : undefined}
    </div>
    {onCopy === undefined && onRegenerate === undefined ? undefined : (
      <div className={styles.actions}>
        {onCopy === undefined ? undefined : <Button onClick={onCopy} text={t(`feedCard.copy`)} />}
        {onRegenerate === undefined ? undefined : (
          <Button disabled={busy} onClick={onRegenerate} text={t(`feedCard.regenerate`)} />
        )}
      </div>
    )}
  </div>
);
