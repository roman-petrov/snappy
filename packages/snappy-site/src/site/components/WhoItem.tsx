import { Block } from "./Block";

export type WhoItemProps = { description: string; icon: string; title: string };

export const WhoItem = ({ description, icon, title }: WhoItemProps) => (
  <Block as="dl" description={description} icon={icon} title={title} withDivider />
);
