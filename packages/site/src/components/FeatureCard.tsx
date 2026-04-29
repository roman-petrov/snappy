import { _ } from "@snappy/core";
import { $, Card, type CardProps, Icon, Text } from "@snappy/ui";

import styles from "./FeatureCard.module.scss";

export type FeatureCardProps = Omit<CardProps, `children`> & { description: string; icon: string; title: string };

export const FeatureCard = ({ cn, description, icon, title, ...props }: FeatureCardProps) => (
  <Card {...props} cn={_.cn(styles.feature, cn)}>
    <span className={_.cn(styles.featureIcon, $.surface(`primary`), $.elevation(`e2`), $.radius(`sm`))}>
      <Icon name={{ emoji: icon }} size="xl" />
    </span>
    <Text as="h3" text={title} typography="h3" />
    <Text text={description} typography="large" />
  </Card>
);
