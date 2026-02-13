import { CardWithIcon } from "./CardWithIcon";

export type FeatureCardProps = { description: string; icon: string; title: string };

export const FeatureCard = ({ description, icon, title }: FeatureCardProps) => (
  <CardWithIcon
    description={description}
    icon={icon}
    title={title}
    variant="feature"
  />
);
