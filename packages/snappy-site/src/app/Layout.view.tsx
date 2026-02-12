import { Outlet } from "react-router-dom";

import { Button } from "../shared/Button";
import { Header } from "../shared/Header";
import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { MutedLink } from "../shared/MutedLink";
import styles from "./Layout.module.css";

import type { useLayoutState } from "./Layout.state";

export type LayoutViewProps = ReturnType<typeof useLayoutState>;

export const LayoutView = ({ headerItems, logoOnClick, logoTitle, logoTo }: LayoutViewProps) => (
  <div className={styles[`wrap`]}>
    <Header logoOnClick={logoOnClick} logoTitle={logoTitle} logoTo={logoTo}>
      {headerItems.map((item, i) =>
        item.type === `button` ? (
          <Button key={i} onClick={item.onClick} type="button">
            {item.label}
          </Button>
        ) : item.type === `link` ? (
          <MutedLink key={i} to={item.to}>
            {item.label}
          </MutedLink>
        ) : (
          <LocaleSwitcher key={i} />
        ),
      )}
    </Header>
    <main className={styles[`main`]}>
      <Outlet />
    </main>
  </div>
);
