import type { ReactNode } from "react";

import { Card } from "@snappy/ui";

import styles from "./Block.module.scss";

export type BlockProps = { children: ReactNode };

export const Block = ({ children }: BlockProps) => (
  <Card children={children} cn={styles.root} elevation="e1" />
);
