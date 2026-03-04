import { HeaderContent } from "@snappy/app";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.scss";

export const Layout = () => (
  <div className={styles.wrap}>
    <div className={styles.corner}>
      <HeaderContent />
    </div>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);
