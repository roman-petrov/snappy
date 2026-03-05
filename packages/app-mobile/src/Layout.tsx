import { Logo, SwitchButtonLocale, SwitchButtonTheme } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.scss";

export const Layout = () => (
  <div className={styles.wrap}>
    <div className={styles.corner}>
      <Logo />
      <div className={styles.cornerRight}>
        <SwitchButtonTheme />
        <SwitchButtonLocale />
      </div>
    </div>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);
