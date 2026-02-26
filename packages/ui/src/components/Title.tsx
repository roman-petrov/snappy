import { Text } from "./Text";
import styles from "./Title.module.css";

export type TitleProps = { as?: `h1` | `h2`; cn?: string; lead?: string; level?: 1 | 2; title: string };

export const Title = ({ as = `h1`, cn = ``, lead, level = 2, title }: TitleProps) => (
  <>
    <Text
      as={as}
      cn={cn ? `${styles.root} ${cn}`.trim() : styles.root}
      color="heading"
      text={title}
      typography={level === 1 ? `h1` : `h2`}
    />
    {lead !== undefined && <Text cn={styles.lead} color="muted" text={lead} typography="large" />}
  </>
);
