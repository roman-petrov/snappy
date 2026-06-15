import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { ChevronDown } from "lucide-react";

import { Chip } from "./Chip";
import { Icon } from "./Icon";
import styles from "./Spoiler.module.scss";

export type SpoilerProps = { children: ReactNode; cn?: string; summary: string };

export const Spoiler = ({ children, cn, summary }: SpoilerProps) => (
  <details className={_.cn(styles.root, cn)}>
    <summary className={styles.summary}>
      <Chip color="soft" left={<Icon cn={styles.chevron} icon={ChevronDown} size="sm" />} text={summary} />
    </summary>
    {children}
  </details>
);
