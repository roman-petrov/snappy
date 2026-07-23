import type { useStreamHtmlState } from "./StreamHtml.state";

export type StreamHtmlViewProps = ReturnType<typeof useStreamHtmlState>;

export const StreamHtmlView = ({ cn, ref }: StreamHtmlViewProps) => <div className={cn} ref={ref} />;
