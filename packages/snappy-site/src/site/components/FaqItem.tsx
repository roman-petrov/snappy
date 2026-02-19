import { css } from "../../../styled-system/css";

export type FaqItemProps = { answer: string; question: string };

export const FaqItem = ({ answer, question }: FaqItemProps) => (
  <div
    className={css({
      "&:not(:last-child)::after": {
        background: `linear-gradient(to right, transparent, rgb(var(--rgb-accent) / 60%), rgb(var(--rgb-accent) / 80%), rgb(var(--rgb-accent) / 60%), transparent)`,
        bottom: 0,
        content: `""`,
        height: `1px`,
        insetInline: 0,
        position: `absolute`,
      },
      "& dd": { color: `text.muted`, fontSize: `md`, lineHeight: `relaxed`, margin: 0 },
      "& dt": {
        color: `text.heading`,
        fontSize: `lg`,
        fontWeight: `bold`,
        letterSpacing: `tight`,
        margin: `0 0 0.5rem`,
      },
      "padding": `1.25rem 0`,
      "position": `relative`,
    })}
  >
    <dt>{question}</dt>
    <dd>{answer}</dd>
  </div>
);
