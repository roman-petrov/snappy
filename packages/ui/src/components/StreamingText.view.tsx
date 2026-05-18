import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import type { useStreamingTextState } from "./StreamingText.state";

import { $ } from "../$";
import styles from "./StreamingText.module.scss";
import { StreamingTextCursor } from "./StreamingTextCursor";

export type StreamingTextViewProps = ReturnType<typeof useStreamingTextState>;

export const StreamingTextView = ({ color, parts, streaming, typography }: StreamingTextViewProps) => (
  <div className={_.cn(styles.text, $.typography(typography), $.color(color))}>
    {parts.map((text, index) => (
      <span className={styles.chunk} key={index} {...Html.text(text)} />
    ))}
    {streaming && <StreamingTextCursor />}
  </div>
);
