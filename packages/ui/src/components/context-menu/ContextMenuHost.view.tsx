import type { useContextMenuHostState } from "./ContextMenuHost.state";

import styles from "./ContextMenu.module.scss";
import { ContextMenuContext } from "./ContextMenuContext";

export type ContextMenuHostViewProps = ReturnType<typeof useContextMenuHostState>;

export const ContextMenuHostView = ({
  children,
  close,
  content,
  layerRef,
  point,
  toggle,
}: ContextMenuHostViewProps) => (
  <ContextMenuContext value={{ close, toggle }}>
    {children}
    <div className={styles.layer} popover="auto" ref={layerRef} style={{ left: point.x, top: point.y }}>
      {content}
    </div>
  </ContextMenuContext>
);
