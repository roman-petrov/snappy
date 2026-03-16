import type { ReactNode } from "react";

import styles from "./SettingsCards.module.scss";

export type SettingsCardsProps = { children: ReactNode };

export const SettingsCards = ({ children }: SettingsCardsProps) => <div className={styles.cards}>{children}</div>;
