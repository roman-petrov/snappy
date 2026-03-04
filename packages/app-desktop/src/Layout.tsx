import { HeaderContent } from "@snappy/app";
import { Header } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.scss";

export const Layout = () => (
  <div className={styles.wrap}>
    <Header>
      <HeaderContent />
    </Header>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);
