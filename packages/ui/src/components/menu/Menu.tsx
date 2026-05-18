import type { MenuButtonProps } from "./MenuButton";

import { useMenuState } from "./Menu.state";
import { MenuView } from "./Menu.view";

export type MenuAction = MenuButtonProps & { key: string };

export type MenuProps = { actions: MenuAction[]; close?: () => void };

export const Menu = (props: MenuProps) => <MenuView {...useMenuState(props)} />;
