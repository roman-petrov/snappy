import { useRouterGo, useRouterQuery } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { Copy } from "@snappy/platform";
import { CircleAlert, Clock } from "lucide-react";

import type { BillingResultSupportProps } from "./BillingResultSupport";

import { AppConfig } from "../../../AppConfig";
import { Routes } from "../../../Routes";

export const useBillingResultSupportState = ({ kind, start = _.noop }: BillingResultSupportProps) => {
  const go = useRouterGo();
  const query = useRouterQuery();
  const details = query.toString();
  const id = query.get(`InvId`) ?? ``;
  const paymentId = id === `` ? `???` : id;
  const home = async () => go(Routes.$.home, { instant: true });
  const retry = async () => go(Routes.billing.topUp, { replace: true });
  const copyDetails = async () => Copy.text(details);
  const icon = kind === `timeout` ? Clock : CircleAlert;
  const iconColor = kind === `failed` ? (`error` as const) : (`warning` as const);
  const { supportEmail } = AppConfig;

  return { copyDetails, details, home, icon, iconColor, kind, paymentId, retry, start, supportEmail };
};
