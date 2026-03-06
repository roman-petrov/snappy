import { HeaderContent } from "@snappy/app";
import { Logo } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.scss";

export const Layout = () => (
  <div className={styles.wrap}>
    <header className={styles.corner}>
      <Logo />
      <div className={styles.cornerRight}>
        <HeaderContent />
      </div>
    </header>
    <div className={styles.scroll}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
    <div aria-hidden className={styles.safeBottom} />
  </div>
);
