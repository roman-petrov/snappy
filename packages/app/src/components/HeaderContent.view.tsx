import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import { Routes } from "../Routes";
import { BalanceTap } from "./BalanceTap";
import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ balanceVisible, logoutOnClick }: HeaderContentViewProps) => (
  <div className={styles.root}>
    <SystemButtons />
    {balanceVisible ? <BalanceTap /> : undefined}
    {logoutOnClick === undefined ? undefined : (
      <IconButton icon={{ emoji: `⚙` }} link={Routes.settings.root} tip={t(`settings.title`)} />
    )}
    {logoutOnClick === undefined ? undefined : (
      <IconButton icon={{ emoji: `➜` }} onClick={logoutOnClick} tip={t(`logout`)} />
    )}
  </div>
);
