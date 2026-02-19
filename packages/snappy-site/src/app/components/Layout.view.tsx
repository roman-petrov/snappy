/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Button, Link } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import type { useLayoutState } from "./Layout.state";

import { css } from "../../../styled-system/css";
import { stack } from "../../../styled-system/patterns";
import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";

export type LayoutViewProps = ReturnType<typeof useLayoutState>;

export const LayoutView = ({ headerItems, logoOnClick, logoTitle, logoTo }: LayoutViewProps) => (
  <div className={stack({ direction: "column", minHeight: "100vh" })}>
    <Header logoOnClick={logoOnClick} logoTitle={logoTitle} logoTo={logoTo}>
      {headerItems.map(item =>
        item.type === "button" ? (
          <Button onClick={item.onClick} type="button">
            {item.label}
          </Button>
        ) : item.type === "link" ? (
          <Link muted to={item.to}>
            {item.label}
          </Link>
        ) : (
          <LocaleSwitcher />
        ),
      )}
    </Header>
    <main
      className={css({
        boxSizing: "border-box",
        flex: 1,
        margin: "0 auto",
        maxWidth: "1100px",
        padding: "1.5rem",
        width: "100%",
      })}
    >
      <Outlet />
    </main>
  </div>
);
