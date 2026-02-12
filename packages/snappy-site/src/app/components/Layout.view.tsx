import { Outlet } from "react-router-dom";

import type { useLayoutState } from "./Layout.state";

import { Button } from "../../shared/Button";
import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";
import { MutedLink } from "../../shared/MutedLink";
import styles from "./Layout.module.css";

export type LayoutViewProps = ReturnType<typeof useLayoutState>;

export const LayoutView = ({ headerItems, logoOnClick, logoTitle, logoTo }: LayoutViewProps) => (
  <div className={styles[`wrap`]}>
    <Header logoOnClick={logoOnClick} logoTitle={logoTitle} logoTo={logoTo}>
      {headerItems.map((item, index) =>
        item.type === `button` ? (
          <Button key={index} onClick={item.onClick} type="button">
            {item.label}
          </Button>
        ) : item.type === `link` ? (
          <MutedLink key={index} to={item.to}>
            {item.label}
          </MutedLink>
        ) : (
          <LocaleSwitcher key={index} />
        ),
      )}
    </Header>
    <main className={styles[`main`]}>
      <Outlet />
    </main>
  </div>
);
