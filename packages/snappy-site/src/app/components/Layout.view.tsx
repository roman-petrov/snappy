/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Button, Link } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import type { useLayoutState } from "./Layout.state";

import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";
import styles from "./Layout.module.css";

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
          <Link muted to={item.to}>
            {item.label}
          </Link>
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
