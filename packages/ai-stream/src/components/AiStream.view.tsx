import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { $ } from "@snappy/ui";

import type { useAiStreamState } from "./AiStream.state";

import styles from "./AiStream.module.scss";
import { AiStreamCaret } from "./AiStreamCaret";

export type AiStreamViewProps = ReturnType<typeof useAiStreamState>;

export const AiStreamView = ({ color, html, streaming, typography }: AiStreamViewProps) => (
  <div className={_.cn(styles.root, $.typography(typography), $.color(color))}>
    <div className={styles.body} {...Html.text(html)} />
    {streaming ? <AiStreamCaret /> : undefined}
  </div>
);
