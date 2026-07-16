import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { Page, type PageProps } from "./Page";
import styles from "./StatusPage.module.scss";
import { Title } from "./Title";

export type StatusPageProps = Omit<PageProps, `children` | `fill` | `title`> & {
  celebrate?: boolean;
  children?: ReactNode;
  cn?: string;
  icon: ReactNode;
  lead?: string;
  title: string;
};

export const StatusPage = ({ celebrate = false, children, cn, icon, lead, title, ...page }: StatusPageProps) => (
  <Page fill {...page}>
    <div className={_.cn(styles.root, celebrate && styles.celebrate, cn)}>
      <div className={styles.media}>{icon}</div>
      <Title lead={lead} level={1} title={title} />
      {children === undefined ? undefined : <div className={styles.actions}>{children}</div>}
    </div>
  </Page>
);
