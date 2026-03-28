import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ logoutOnClick }: HeaderContentViewProps) => (
  <div className={styles.root}>
    <SystemButtons />
    {logoutOnClick === undefined ? undefined : (
      <IconButton icon={{ emoji: `⚙` }} link="/settings" tip={t(`settings.title`)} />
    )}
    {logoutOnClick === undefined ? undefined : (
      <IconButton icon={{ emoji: `➜` }} onClick={logoutOnClick} tip={t(`logout`)} />
    )}
  </div>
);
