import { Html } from "@snappy/browser";
import { memo, type Ref } from "react";

export type StreamHtmlProps = { cn?: string; html: string; tailHostRef?: Ref<HTMLDivElement | null> };

const StreamHtmlView = ({ cn, html, tailHostRef }: StreamHtmlProps) =>
  tailHostRef === undefined ? <div className={cn} {...Html.text(html)} /> : <div className={cn} ref={tailHostRef} />;

export const StreamHtml = memo(StreamHtmlView);
