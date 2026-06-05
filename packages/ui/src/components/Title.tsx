import { _ } from "@snappy/core";

import { Text } from "./Text";
import styles from "./Title.module.scss";

export type TitleProps = { as?: `h1` | `h2`; cn?: string; lead?: string; level?: 1 | 2; title: string };

export const Title = ({ as = `h1`, cn = ``, lead, level = 2, title }: TitleProps) => (
  <div className={styles.block}>
    <Text as={as} cn={cn} text={title} typography={level === 1 ? `h1` : `h2`} />
    {lead === undefined ? undefined : <Text text={lead} typography="large" />}
  </div>
);
