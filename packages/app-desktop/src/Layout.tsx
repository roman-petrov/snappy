/* jscpd:ignore-start */
import { HeaderContent } from "@snappy/app";
import { Header } from "@snappy/ui";
import { Redirect, Route, Switch } from "wouter";

import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import styles from "./Layout.module.scss";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

export const Layout = () => (
  <div className={styles.wrap}>
    <Header>
      <HeaderContent />
    </Header>
    <main className={styles.main}>
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
/* jscpd:ignore-end */
