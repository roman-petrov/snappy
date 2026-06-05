import { Chip } from "@snappy/ui";

import type { useBalanceTapState } from "./BalanceTap.state";

import { t } from "../core";
import { Routes } from "../Routes";
import styles from "./BalanceTap.module.scss";

export type BalanceTapViewProps = ReturnType<typeof useBalanceTapState>;

export const BalanceTapView = ({ label }: BalanceTapViewProps) => (
  <Chip
    cn={styles.root}
    color="soft"
    link={Routes.settings.profile.topUp}
    text={label}
    tip={t(`balance.common.tapTip`)}
  />
);
