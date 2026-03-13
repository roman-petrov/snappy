/* jscpd:ignore-start */
import { Header, Logo } from "@snappy/ui";
import { Redirect, Route, Switch, useLocation } from "wouter";

import { HeaderContent } from "./components";
import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import { useIsMobile } from "./hooks/useMediaQuery";
import styles from "./Layout.module.scss";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

export const Layout = () => {
  const [path] = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={styles.wrap} data-mobile>
        <header className={styles.overlayTop}>
          <div className={styles.corner}>
            <Logo />
            <div className={styles.cornerRight}>
              <HeaderContent />
            </div>
          </div>
        </header>
        <div className={styles.scroll}>
          <main className={`${styles.main} ${path === `/` ? styles.mainDashboard : ``}`}>
            <Switch>
              <Route component={Login} path="/login" />
              <Route component={Register} path="/register" />
              <Route component={ForgotPassword} path="/forgot-password" />
              <Route component={ResetPassword} path="/reset-password" />
              <Route component={Dashboard} path="/" />
              <Route path="*">
                <Redirect replace to="/" />
              </Route>
            </Switch>
          </main>
        </div>
        <footer className={styles.overlayBottom}>
          <div aria-hidden className={styles.safeBottom} />
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.wrap} data-desktop>
      <Header>
        <HeaderContent />
      </Header>
      <main className={`${styles.main} ${path === `/` ? styles.mainDashboard : ``}`}>
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={ForgotPassword} path="/forgot-password" />
          <Route component={ResetPassword} path="/reset-password" />
          <Route component={Dashboard} path="/" />
          <Route path="*">
            <Redirect replace to="/" />
          </Route>
        </Switch>
      </main>
    </div>
  );
};
/* jscpd:ignore-end */
