import type { Ref } from "react";

import { Html } from "@snappy/browser";

export type StreamHtmlProps = { cn?: string; html: string; tailHostRef?: Ref<HTMLDivElement | null> };

export const StreamHtml = ({ cn, html, tailHostRef }: StreamHtmlProps) =>
  tailHostRef === undefined ? <div className={cn} {...Html.text(html)} /> : <div className={cn} ref={tailHostRef} />;
