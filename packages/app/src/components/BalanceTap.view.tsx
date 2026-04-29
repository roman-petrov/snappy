import { _ } from "@snappy/core";
import { $, Tap } from "@snappy/ui";

import type { useBalanceTapState } from "./BalanceTap.state";

import { t } from "../core";
import { Routes } from "../Routes";
import styles from "./BalanceTap.module.scss";

export type BalanceTapViewProps = ReturnType<typeof useBalanceTapState>;

export const BalanceTapView = ({ label }: BalanceTapViewProps) => (
  <Tap
    cn={_.cn($.tap(`soft`), $.radius(`lg`), styles.root)}
    link={Routes.balance.topUp}
    tip={t(`balance.common.tapTip`)}
  >
    {label}
  </Tap>
);
