/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { CSSProperties } from "react";

import { _ } from "@snappy/core";

import { $ } from "../../$";
import styles from "./Menu.module.scss";
import { MenuButton, type MenuButtonProps } from "./MenuButton";

export type MenuAction = MenuButtonProps & { key: string };

export type MenuProps = { actions: MenuAction[]; close?: () => void };

export const Menu = ({ actions, close }: MenuProps) => {
  if (actions.length === 0) {
    return undefined;
  }
  const actionOutStep = Math.max(actions.length - 1, 0);

  return (
    <div className={_.cn($.tap(`soft`), $.radius(`lg`), styles.root)}>
      {actions.map((action, index) => (
        <div
          className={styles.action}
          key={action.key}
          style={{ "--action-index": index, "--action-out-index": actionOutStep - index } as CSSProperties}
        >
          <MenuButton
            {...action}
            onClick={() => {
              action.onClick?.();
              close?.();
            }}
          />
        </div>
      ))}
    </div>
  );
};
