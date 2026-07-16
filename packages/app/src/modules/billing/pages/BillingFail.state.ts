import { useRouterQuery } from "@snappy/app-router";

import { useExternalReady } from "../../../components/hooks";

export const useBillingFailState = () => {
  const paymentId = useRouterQuery().get(`InvId`) ?? ``;
  const screen = paymentId === `` ? (`failed` as const) : (`canceled` as const);

  useExternalReady();

  return { screen };
};
