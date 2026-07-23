import { useLabState } from "./Lab.state";
import { LabView } from "./Lab.view";

export const Lab = () => <LabView {...useLabState()} />;
