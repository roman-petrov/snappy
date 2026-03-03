/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Button, Header, Link, LocaleSwitcher } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import type { useLayoutState } from "./Layout.state";

import styles from "./Layout.module.scss";

export type LayoutViewProps = ReturnType<typeof useLayoutState>;

export const LayoutView = ({ headerItems, logoOnClick, logoTitle, logoTo }: LayoutViewProps) => (
  <div className={styles.wrap}>
    <Header logoOnClick={logoOnClick} logoTitle={logoTitle} logoTo={logoTo}>
      {headerItems.map(item =>
        item.type === `button` ? (
          <Button onClick={item.onClick} type="button">
            {item.label}
          </Button>
        ) : item.type === `link` ? (
          <Link muted text={item.label} to={item.to} />
        ) : (
          <LocaleSwitcher />
        ),
      )}
    </Header>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);
