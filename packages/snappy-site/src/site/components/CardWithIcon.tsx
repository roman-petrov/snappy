import { Block } from "@snappy/ui";

import styles from "./CardWithIcon.module.css";

export type CardWithIconProps = { description: string; icon: string; title: string; variant: `feature` | `who` };

export const CardWithIcon = ({ description, icon, title, variant }: CardWithIconProps) => {
  if (variant === `who`) {
    return <Block as="dl" description={description} icon={icon} title={title} withDivider />;
  }

  return (
    <div className={styles.feature}>
      <span className={styles.featureIcon}>{icon}</span>
      <Block description={description} title={title} />
    </div>
  );
};
