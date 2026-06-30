import { useSnappyState } from "./Snappy.state";
import { SnappyView } from "./Snappy.view";

export const Snappy = () => <SnappyView {...useSnappyState()} />;
