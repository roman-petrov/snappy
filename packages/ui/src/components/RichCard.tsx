import { $ } from "../$";
import { CardButton, type CardButtonProps } from "./CardButton";
import { CardRow } from "./CardRow";

export type RichCardProps = Omit<CardButtonProps, `children`> & { description: string; emoji: string; title: string };

export const RichCard = ({ cn, description, emoji, title, ...tapProps }: RichCardProps) => (
  <CardButton {...tapProps} cn={cn}>
    <CardRow emoji={emoji}>
      <span className={$.typography(`h3`)}>{title}</span>
      <span className={$.typography(`caption`)}>{description}</span>
    </CardRow>
  </CardButton>
);
