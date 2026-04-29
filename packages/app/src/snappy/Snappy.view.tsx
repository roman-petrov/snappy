import { Button } from "@snappy/ui";

import type { useSnappyState } from "./Snappy.state";

import { Page } from "../components";
import { t } from "../core";
import { Routes } from "../Routes";
import { Composer } from "./components";
import styles from "./Snappy.module.scss";

export type SnappyViewProps = ReturnType<typeof useSnappyState>;

export const SnappyView = ({ balanceLow, desk, onStop, splash }: SnappyViewProps) => (
  <Page title="Snappy">
    <div className={styles.pageBody}>
      <div className={styles.actionRow}>
        <Button onClick={onStop} text={t(`agent.stop`)} />
      </div>
      {balanceLow && (
        <div>
          <p>{t(`balance.common.lowLead`)}</p>
          <Button link={Routes.balance.topUp} text={t(`balance.topUp.cta`)} type="primary" />
        </div>
      )}
      {!balanceLow && splash !== undefined && (
        <div className={styles.splash}>
          <Composer onChange={splash.setDraft} onSend={splash.onSend} value={splash.draft} />
        </div>
      )}
      {!balanceLow && desk !== undefined && (
        <>
          <div className={styles.session}>
            <div className={styles.feed}>{desk.feed}</div>
          </div>
          <div className={styles.composer}>
            <div className={styles.composerInner}>
              <Composer onChange={desk.setDraft} onSend={desk.onSend} value={desk.draft} />
            </div>
          </div>
        </>
      )}
    </div>
  </Page>
);
