import type { MetaParameters } from "../../common/Meta";

import {
  type SimpleStaticAgentComponentInput,
  useSimpleStaticAgentComponentState,
} from "./SimpleStaticAgentComponent.state";
import { SimpleStaticAgentComponentView } from "./SimpleStaticAgentComponent.view";

export const SimpleStaticAgentComponent = <P extends MetaParameters>(props: SimpleStaticAgentComponentInput<P>) => (
  <SimpleStaticAgentComponentView {...useSimpleStaticAgentComponentState(props)} />
);
