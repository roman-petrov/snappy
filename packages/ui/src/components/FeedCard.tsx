import type { ReactNode } from "react";

import { BusyShimmerOverlay } from "./BusyShimmerOverlay";
import { Button } from "./Button";
import styles from "./FeedCard.module.scss";

export type FeedCardProps = {
  busy?: boolean;
  children: ReactNode;
  copyLabel?: string;
  onCopy?: () => void;
  onRegenerate?: () => Promise<void> | void;
  regenerateLabel?: string;
};

export const FeedCard = ({
  busy = false,
  children,
  copyLabel = `Copy`,
  onCopy,
  onRegenerate,
  regenerateLabel = `Regenerate`,
}: FeedCardProps) => (
  <div className={styles.root}>
    <div className={styles.body}>
      {children}
      {busy ? <BusyShimmerOverlay /> : undefined}
    </div>
    {onCopy === undefined && onRegenerate === undefined ? undefined : (
      <div className={styles.actions}>
        {onCopy === undefined ? undefined : <Button onClick={onCopy} text={copyLabel} />}
        {onRegenerate === undefined ? undefined : (
          <Button disabled={busy} onClick={onRegenerate} text={regenerateLabel} />
        )}
      </div>
    )}
  </div>
);
