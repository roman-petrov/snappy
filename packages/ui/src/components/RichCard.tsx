import { _ } from "@snappy/core";

import { $ } from "../$";
import { CardButton, type CardButtonProps } from "./CardButton";
import { Icon } from "./Icon";
import styles from "./RichCard.module.scss";

export type RichCardProps = Omit<CardButtonProps, `children` | `cn`> & {
  description: string;
  icon: Icon;
  title: string;
};

export const RichCard = ({ description, icon, title, ...tapProps }: RichCardProps) => (
  <CardButton {...tapProps} cn={styles.root}>
    <span className={_.cn(styles.icon, $.surface(`primary`), $.elevation(`e2`), $.radius(`md`))}>
      <Icon icon={icon} size="xl" />
    </span>
    <span className={styles.body}>
      <span className={$.typography(`h3`)}>{title}</span>
      <span className={$.typography(`caption`)}>{description}</span>
    </span>
  </CardButton>
);
