import type { ReactNode } from "react";

import { Text } from "./Text";
import styles from "./Title.module.css";

export type TitleProps = { as?: `h1` | `h2`; children: ReactNode; cn?: string; lead?: string; level?: 1 | 2 };

export const Title = ({ as = `h1`, children, cn = ``, lead, level = 2 }: TitleProps) => (
  <>
    <Text as={as} cn={cn ? `${styles.root} ${cn}`.trim() : styles.root} variant={level === 1 ? `h1` : `h2`}>
      {children}
    </Text>
    {lead !== undefined && (
      <Text cn={styles.lead} variant="large">
        {lead}
      </Text>
    )}
  </>
);
