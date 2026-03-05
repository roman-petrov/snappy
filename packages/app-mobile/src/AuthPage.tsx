import type { ReactNode } from "react";

import { Title } from "@snappy/ui";

import styles from "./AuthPage.module.scss";

export const AuthPage = ({ children, title }: { children: ReactNode; title: string }) => (
  <div className={styles.wrap}>
    <div className={styles.title}>
      <Title level={1} title={title} />
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);
