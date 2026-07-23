import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Card, type CardProps } from "@snappy/ui";

import styles from "./Block.module.scss";

export type BlockProps = {
  children: ReactNode;
  cn?: string;
  elevation?: CardProps[`elevation`];
  radius?: CardProps[`radius`];
};

export const Block = ({ children, cn, elevation = `none`, radius }: BlockProps) => (
  <Card children={children} cn={_.cn(styles.root, cn)} elevation={elevation} radius={radius} />
);
