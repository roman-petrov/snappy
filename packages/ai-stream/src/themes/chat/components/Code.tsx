import type { CodeViewProps } from "../../../core/Types";

import { useCodeState } from "./Code.state";
import { CodeView } from "./Code.view";

export const Code = (props: CodeViewProps) => <CodeView {...useCodeState(props)} />;
