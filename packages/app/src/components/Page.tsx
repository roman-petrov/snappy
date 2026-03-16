import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Tap, type TapProps, Title } from "@snappy/ui";

import styles from "./Page.module.scss";

export type PageProps = Omit<TapProps, `children` | `cn` | `link`> & {
  backLabel?: string;
  backLink?: string;
  bleed?: boolean;
  children: ReactNode;
  title?: string;
};

export const Page = ({ backLabel, backLink, bleed = false, children, title, ...tapProps }: PageProps) => {
  const back = backLabel !== undefined && backLink !== undefined;

  return (
    <section className={_.cn(styles.section, bleed ? styles.sectionBleed : ``)}>
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
