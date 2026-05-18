import type { MenuProps } from "./Menu";

export const useMenuState = ({ actions, close }: MenuProps) => {
  const actionOutStep = Math.max(actions.length - 1, 0);

  const items = actions.map((action, index) => {
    const { key } = action;
    const outIndex = actionOutStep - index;

    const onClick = () => {
      action.onClick?.();
      close?.();
    };

    return { action, index, key, onClick, outIndex };
  });

  return { items };
};
