import { Text } from "@snappy/ui";

import styles from "./FeatureCard.module.css";

export type FeatureCardProps = { description: string; icon: string; title: string };

export const FeatureCard = ({ description, icon, title }: FeatureCardProps) => (
  <div className={styles.feature}>
    <span aria-hidden className={styles.featureIcon}>
      {icon}
    </span>
    <Text as="h3" color="heading" text={title} typography="h3" />
    <Text color="muted" text={description} typography="large" />
  </div>
);
