import { Html } from "@snappy/browser";

import type { useStreamingTextState } from "./StreamingText.state";

import { $ } from "../$";
import styles from "./StreamingText.module.scss";

export type StreamingTextViewProps = ReturnType<typeof useStreamingTextState>;

export const StreamingTextView = ({ streaming, text, typography }: StreamingTextViewProps) => (
  <p className={`${styles.text} ${$.typography(typography ?? `body`)}`}>
    <span {...Html.text(text)} />
    {streaming && <span aria-hidden className={styles.cursor} />}
  </p>
);
