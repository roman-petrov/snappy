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
    {!busy && (onCopy !== undefined || onRegenerate !== undefined) ? (
      <div className={styles.actions}>
        {onCopy === undefined ? undefined : <Button onClick={onCopy} text={t(`feedCard.copy`)} />}
        {onRegenerate === undefined ? undefined : (
          <Button onClick={onRegenerate} text={t(`feedCard.regenerate`)} />
        )}
      </div>
    ) : undefined}
  </div>
);
