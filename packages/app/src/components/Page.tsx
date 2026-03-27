import type { ReactNode } from "react";

import { Tap, type TapProps, Title } from "@snappy/ui";

import styles from "./Page.module.scss";

export type PageProps = Omit<TapProps, `children` | `cn` | `link`> & {
  backLabel?: string;
  backLink?: string;
  children: ReactNode;
  title?: string;
};

export const Page = ({ backLabel, backLink, children, title, ...tapProps }: PageProps) => {
  const back = backLabel !== undefined && backLink !== undefined;

  return (
    <section className={styles.section}>
      {back ? (
        <Tap {...tapProps} cn={styles.back} link={backLink}>
          ← {backLabel}
        </Tap>
      ) : undefined}
      {title === undefined ? undefined : (
        <div className={styles.title}>
          <Title level={1} title={title} />
        </div>
      )}
      {children}
    </section>
  );
};
