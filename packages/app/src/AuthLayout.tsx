import type { ReactNode } from "react";

import { Panel, Title } from "@snappy/ui";

import styles from "./AuthLayout.module.scss";
import { useIsMobile } from "./hooks/useMediaQuery";

export type AuthLayoutProps = { children: ReactNode; lead?: string; title: string };

export const AuthLayout = ({ children, lead, title }: AuthLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <Title level={1} title={title} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  return (
    <Panel lead={lead} title={title}>
      {children}
    </Panel>
  );
};
