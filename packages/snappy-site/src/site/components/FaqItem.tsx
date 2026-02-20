import { Block } from "@snappy/ui";

export type FaqItemProps = { answer: string; question: string };

export const FaqItem = ({ answer, question }: FaqItemProps) => (
  <Block as="dl" description={answer} title={question} withDivider />
);
