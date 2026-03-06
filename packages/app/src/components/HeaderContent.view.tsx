/* eslint-disable @typescript-eslint/strict-void-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ logout }: HeaderContentViewProps) => (
  <div className={styles.root}>
    <SystemButtons />
    {logout === undefined ? undefined : <IconButton ariaLabel={logout.label} icon="➜]" onClick={logout.onClick} />}
  </div>
);
