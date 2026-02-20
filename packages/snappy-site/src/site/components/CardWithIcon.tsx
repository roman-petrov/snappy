import { Block, ListItem } from "@snappy/ui";

import styles from "./CardWithIcon.module.css";

export type CardWithIconProps = { description: string; icon: string; title: string; variant: `feature` | `who` };

export const CardWithIcon = ({ description, icon, title, variant }: CardWithIconProps) => {
  if (variant === `who`) {
    return (
      <ListItem>
        <div className={styles.who}>
          <span className={styles.whoIcon}>{icon}</span>
          <Block description={description} title={title} />
        </div>
      </ListItem>
    );
  }

  return (
    <div className={styles.feature}>
      <span className={styles.featureIcon}>{icon}</span>
      <Block description={description} title={title} />
    </div>
  );
};
