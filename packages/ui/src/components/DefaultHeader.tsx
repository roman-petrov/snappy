import type { ReactNode } from "react";

import styles from "./DefaultHeader.module.scss";
import { Header } from "./Header";
import { Logo } from "./Logo";

export type DefaultHeaderProps = { trailing: ReactNode };

export const DefaultHeader = ({ trailing }: DefaultHeaderProps) => (
  <Header cn={styles.root}>
    <Logo />
    <div className={styles.trailing}>{trailing}</div>
  </Header>
);
