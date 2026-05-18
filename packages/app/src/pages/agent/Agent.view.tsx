import { Button } from "@snappy/ui";
import { Navigate } from "react-router-dom";

import type { useAgentState } from "./Agent.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "../catalog/Catalog.module.scss";

export type AgentViewProps = ReturnType<typeof useAgentState>;

export const AgentView = ({ session }: AgentViewProps) =>
  session === undefined ? (
    <Navigate replace to={Routes.home} />
  ) : (
    <Page title={session.title}>
      <div className={styles.head}>
        <Button onClick={session.onStop} text={t(`agent.stop`)} />
      </div>
      {session.balanceLow ? (
        <div>
          <p>{t(`balance.common.lowLead`)}</p>
          <Button link={Routes.balance.topUp} text={t(`balance.topUp.cta`)} type="primary" />
        </div>
      ) : (
        session.screen
      )}
    </Page>
  );
