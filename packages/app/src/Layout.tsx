import { Header, Logo } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import { AuthGuard } from "./AuthGuard";
import { HeaderContent } from "./components";
import styles from "./Layout.module.scss";

export const Layout = () => {
  return (
    <div className={styles.wrap}>
      <header className={styles.mobileHeader}>
        <div className={styles.corner}>
          <Logo />
          <div className={styles.cornerRight}>
            <HeaderContent />
          </div>
        </div>
      </header>
      <div className={styles.desktopHeader}>
        <Header>
          <HeaderContent />
        </Header>
      </div>
      <div className={styles.scroll}>
        <main className={styles.main}>
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        </main>
      </div>
    </div>
  );
};
