import { Button } from "@snappy/ui";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";

export const BalanceLow = () => (
  <Page back title={t(`balance.lowTitle`)}>
    <p>{t(`balance.lowLead`)}</p>
    <Button link={Routes.balance.topUp} text={t(`balance.topUpCta`)} type="primary" />
  </Page>
);
