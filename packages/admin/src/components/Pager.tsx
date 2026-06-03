import { type PagerStateInput, usePagerState } from "./Pager.state";
import { PagerView } from "./Pager.view";

export type PagerProps = PagerStateInput;

export const Pager = (props: PagerProps) => <PagerView {...usePagerState(props)} />;
