import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./Card.module.scss";

export type CardProps = { children: ReactNode; cn?: string };

export const Card = ({ children, cn }: CardProps) => <div className={_.cn(styles.root, cn)}>{children}</div>;
