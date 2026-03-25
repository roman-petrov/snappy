import { TextCardView } from "./TextCard.view";

export type TextCardProps = { compact?: boolean; loading: boolean; result: string };

export const TextCard = (props: TextCardProps) => <TextCardView {...props} />;
