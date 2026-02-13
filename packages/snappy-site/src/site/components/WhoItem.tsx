import { CardWithIcon } from "./CardWithIcon";

export type WhoItemProps = { description: string; icon: string; title: string };

export const WhoItem = ({ description, icon, title }: WhoItemProps) => (
  <CardWithIcon
    description={description}
    icon={icon}
    title={title}
    variant="who"
  />
);
