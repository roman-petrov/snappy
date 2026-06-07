/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { CSSProperties } from "react";

import { _ } from "@snappy/core";

import type { useMenuState } from "./Menu.state";

import { $ } from "../../$";
import styles from "./Menu.module.scss";
import { MenuButton } from "./MenuButton";

export type MenuViewProps = ReturnType<typeof useMenuState>;

export const MenuView = ({ items }: MenuViewProps) =>
  items.length === 0 ? undefined : (
    <div className={_.cn($.surface(`surface`), $.glass(`simple`), $.elevation(`e2`), $.radius(`lg`), styles.root)}>
      {items.map(({ action, index, key, onClick, outIndex }) => (
        <div
          className={styles.action}
          key={key}
          style={{ "--action-index": index, "--action-out-index": outIndex } as CSSProperties}
        >
          <MenuButton {...action} onClick={onClick} />
        </div>
      ))}
    </div>
  );
