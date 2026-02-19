import { css } from "../../../styled-system/css";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <div
    className={css({
      _before: {
        background: "border",
        borderRadius: "1px",
        content: '""',
        insetBlock: "0.75rem",
        insetInlineStart: "1.125rem",
        position: "absolute",
        width: "2px",
      },
      paddingInlineStart: "2.5rem",
      position: "relative",
    })}
  >
    <ol
      className={css({
        "& li": {
          _before: {
            alignItems: "center",
            bg: "accent",
            borderRadius: "50%",
            color: "onAccent",
            content: "counter(step)",
            counterIncrement: "step",
            display: "flex",
            fontSize: "sm",
            fontWeight: "bold",
            height: "1.75rem",
            insetInlineStart: "calc(-1 * 2.5rem + 0.375rem)",
            justifyContent: "center",
            lineHeight: 1,
            position: "absolute",
            width: "1.75rem",
            zIndex: 1,
          },
          color: "text.body",
          margin: "1rem 0",
          paddingBlockStart: "0.25rem",
          paddingInlineStart: "1.25rem",
          position: "relative",
        },
        "& li:first-child": { marginBlockStart: 0 },
        "counterReset": "step",
        "listStyle": "none",
        "margin": 0,
        "padding": 0,
      })}
    >
      {items.map(text => (
        <li key={text}>{text}</li>
      ))}
    </ol>
  </div>
);
