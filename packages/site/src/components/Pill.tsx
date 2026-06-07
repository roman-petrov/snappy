import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";

import styles from "./Pill.module.scss";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div className={_.cn(styles.pill, $.surface(`surface`), $.elevation(`e1`), $.radius(`md`))}>
    <Text color="primary" text={name} typography="captionBold" />
    <Text text={hint} typography="large" />
  </div>
);
