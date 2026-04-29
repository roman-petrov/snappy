import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import { $ } from "../$";
import styles from "./Header.module.scss";
import { Logo } from "./Logo";

export type HeaderProps = { children: ReactNode; cn?: string };

export const Header = ({ children, cn = `` }: HeaderProps) => (
  <header className={_.cn($.surface(`surface`), $.elevation(`e1`), cn)}>
    <div className={styles.inner}>
      <Logo />
      <div className={styles.trailing}>{children}</div>
    </div>
  </header>
);
