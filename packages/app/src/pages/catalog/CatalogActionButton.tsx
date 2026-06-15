import type { LucideIcon } from "lucide-react";

import { _ } from "@snappy/core";
import { $, Icon, Tap } from "@snappy/ui";

import styles from "./CatalogActionButton.module.scss";

export type CatalogActionButtonProps = { icon: LucideIcon; link: string; primary?: boolean; text: string };

export const CatalogActionButton = ({ icon, link, primary = false, text }: CatalogActionButtonProps) => (
  <Tap
    cn={_.cn(styles.root, primary ? _.cn(styles.primary, $.tap(`accent`)) : _.cn(styles.soft, $.tap(`soft`)))}
    link={link}
    vibrate="segmentTick"
  >
    <Icon icon={icon} size="sm" />
    <span className={$.typography(`button`)}>{text}</span>
  </Tap>
);
