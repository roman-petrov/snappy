import { i } from "@snappy/intl";
import { Chip } from "@snappy/ui";

import type { useBalanceTapState } from "./BalanceTap.state";

import { t } from "../core";
import { Routes } from "../Routes";
import styles from "./BalanceTap.module.scss";

export type BalanceTapViewProps = ReturnType<typeof useBalanceTapState>;

export const BalanceTapView = ({ balance }: BalanceTapViewProps) => (
  <Chip
    cn={styles.root}
    color="soft"
    link={Routes.settings.profile.topUp}
    text={balance === undefined ? `…` : i.price(balance)}
    tip={t(`balance.common.tapTip`)}
  />
);
