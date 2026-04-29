import type { TextProps } from "@snappy/ui";

export type StatusTextProps = TextProps & { finished: Promise<{ label: string }> };

import { useStatusTextState } from "./StatusText.state";
import { StatusTextView } from "./StatusText.view";

export const StatusText = (props: StatusTextProps) => <StatusTextView {...useStatusTextState(props)} />;
