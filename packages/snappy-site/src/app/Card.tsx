import type { ReactNode } from "react";

import styles from "./Card.module.css";

export type CardProps = { children: ReactNode; className?: string; glass?: boolean; narrow?: boolean };

export const Card = ({ children, className = ``, glass = false, narrow = false }: CardProps) => {
  const classes = [styles[`root`], glass ? styles[`glass`] : ``, narrow ? styles[`narrow`] : ``, className]
    .filter(Boolean)
    .join(` `);

  return <div className={classes}>{children}</div>;
};
