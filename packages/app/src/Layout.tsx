import { Header, Logo, useIsMobile } from "@snappy/ui";
import { Outlet, useLocation } from "react-router-dom";

import { AuthGuard } from "./AuthGuard";
import { HeaderContent } from "./components";
import styles from "./Layout.module.scss";

export const Layout = () => {
  const { pathname } = useLocation();

  const main = (
    <main className={`${styles.main} ${pathname === `/` ? styles.mainDashboard : ``}`}>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    </main>
  );

  return useIsMobile() ? (
    <div className={styles.wrap} data-mobile>
      <header className={styles.overlayTop}>
        <div className={styles.corner}>
          <Logo />
          <div className={styles.cornerRight}>
            <HeaderContent />
          </div>
        </div>
      </header>
      <div className={styles.scroll}>{main}</div>
    </div>
  ) : (
    <div className={styles.wrap} data-desktop>
      <Header>
        <HeaderContent />
      </Header>
      {main}
    </div>
  );
};
