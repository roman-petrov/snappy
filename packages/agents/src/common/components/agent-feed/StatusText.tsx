import type { TextProps } from "@snappy/ui";

import { useStatusTextState } from "./StatusText.state";
import { StatusTextView } from "./StatusText.view";

export type StatusTextProps = TextProps & { finished: Promise<{ label: string }> };

export const StatusText = (props: StatusTextProps) => <StatusTextView {...useStatusTextState(props)} />;
