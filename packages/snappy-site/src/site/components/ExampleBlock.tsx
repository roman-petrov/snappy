import type { ReactNode } from "react";

import { css, cx } from "../../../styled-system/css";
import { center, grid } from "../../../styled-system/patterns";

export type ExampleBlockProps = {
  after: ReactNode;
  afterLabel: string;
  before: string;
  beforeLabel: string;
  label: string;
};

export const ExampleBlock = ({ after, afterLabel, before, beforeLabel, label: labelText }: ExampleBlockProps) => (
  <div className={css({ _last: { marginBlockEnd: 0 }, marginBlockEnd: `1.5rem` })}>
    <p
      className={css({
        border: `1px solid rgb(var(--rgb-accent) / 20%)`,
        borderRadius: `sm`,
        color: `accent`,
        display: `inline-block`,
        fontSize: `sm`,
        fontWeight: `semibold`,
        margin: `0 0 0.75rem`,
        padding: `0.5rem 0.75rem`,
      })}
    >
      {labelText}
    </p>
    <div
      className={grid({
        "@media (width <= 640px)": { gap: `1rem`, gridTemplateColumns: `1fr` },
        "alignItems": `center`,
        "gap": `1.25rem`,
        "gridTemplateColumns": `1fr auto 1fr`,
      })}
    >
      <div
        className={cx(
          css({
            "& p": { color: `text.body`, fontSize: `md`, lineHeight: 1.6, margin: 0 },
            "@media (width <= 640px)": { "& p": { fontSize: `base` }, "minHeight": `auto`, "padding": `1rem` },
            "borderInlineStart": `3px solid`,
            "borderRadius": `0 sm sm 0`,
            "minHeight": `6rem`,
            "padding": `1.25rem 1.5rem`,
          }),
          css({ bg: `rgb(var(--rgb-accent-red) / 4%)`, borderColor: `accentRed` }),
        )}
      >
        <span
          className={cx(
            css({
              display: `block`,
              fontSize: `xs`,
              fontWeight: `semibold`,
              letterSpacing: `wide`,
              marginBlockEnd: `0.75rem`,
              textTransform: `uppercase`,
            }),
            css({ color: `accentRed`, fontWeight: `bold` }),
          )}
        >
          {beforeLabel}
        </span>
        <p>{before}</p>
      </div>
      <span
        aria-hidden="true"
        className={center({
          "@media (width <= 640px)": { transform: `rotate(90deg)` },
          "color": `accent`,
          "flexShrink": 0,
          "fontSize": `xl`,
          "fontWeight": `bold`,
        })}
      >
        →
      </span>
      <div
        className={cx(
          css({
            "& p": { color: `text.body`, fontSize: `md`, lineHeight: 1.6, margin: 0 },
            "@media (width <= 640px)": { "& p": { fontSize: `base` }, "minHeight": `auto`, "padding": `1rem` },
            "borderInlineStart": `3px solid`,
            "borderRadius": `0 sm sm 0`,
            "minHeight": `6rem`,
            "padding": `1.25rem 1.5rem`,
          }),
          css({ bg: `rgb(var(--rgb-accent) / 4%)`, borderColor: `accent` }),
        )}
      >
        <span
          className={cx(
            css({
              display: `block`,
              fontSize: `xs`,
              fontWeight: `semibold`,
              letterSpacing: `wide`,
              marginBlockEnd: `0.75rem`,
              textTransform: `uppercase`,
            }),
            css({ color: `accent`, fontWeight: `bold` }),
          )}
        >
          {afterLabel}
        </span>
        <p>{after}</p>
      </div>
    </div>
  </div>
);
