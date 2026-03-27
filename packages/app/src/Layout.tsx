import { Header, Logo, SafeArea } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import { AuthGuard } from "./AuthGuard";
import { HeaderContent } from "./components";
import styles from "./Layout.module.scss";

export const Layout = () => (
  <div className={styles.wrap}>
    <header className={styles.mobileHeader}>
      <SafeArea left right top>
        <div className={styles.corner}>
          <Logo />
          <div className={styles.cornerRight}>
            <HeaderContent />
          </div>
        </div>
      </SafeArea>
    </header>
    <div className={styles.desktopHeader}>
      <Header>
        <HeaderContent />
      </Header>
    </div>
    <div className={styles.scroll}>
      <SafeArea bottom cn={styles.mainSafe} left right top>
        <main className={styles.main}>
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        </main>
      </SafeArea>
    </div>
  </div>
);
