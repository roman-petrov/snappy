import type { useCustomHeaderPageState } from "./CustomHeaderPage.state";

import styles from "./CustomHeaderPage.module.scss";

export type CustomHeaderPageViewProps = ReturnType<typeof useCustomHeaderPageState>;

export const CustomHeaderPageView = ({ children }: CustomHeaderPageViewProps) => (
  <section className={styles.section}>{children}</section>
);
