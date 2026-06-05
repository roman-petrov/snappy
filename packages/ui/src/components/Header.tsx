import { _ } from "@snappy/core";
import type { ReactNode } from "react";

import styles from "./Header.module.scss";
import { SafeArea } from "./SafeArea";

export type HeaderProps = { children: ReactNode; cn?: string };

export const Header = ({ children, cn }: HeaderProps) => (
  <SafeArea top>
    <div className={_.cn(styles.inner, cn)}>{children}</div>
  </SafeArea>
);
