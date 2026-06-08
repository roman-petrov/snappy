/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { CSSProperties } from "react";

import type { useMenuState } from "./Menu.state";

import { Card } from "../Card";
import styles from "./Menu.module.scss";
import { MenuButton } from "./MenuButton";

export type MenuViewProps = ReturnType<typeof useMenuState>;

export const MenuView = ({ items }: MenuViewProps) =>
  items.length === 0 ? undefined : (
    <Card cn={styles.root} radius="lg">
      {items.map(({ action, index, key, onClick, outIndex }) => (
        <div
          className={styles.action}
          key={key}
          style={{ "--action-index": index, "--action-out-index": outIndex } as CSSProperties}
        >
          <MenuButton {...action} onClick={onClick} />
        </div>
      ))}
    </Card>
  );
