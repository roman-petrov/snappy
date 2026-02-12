import { useLayoutState } from "./Layout.state";
import { LayoutView } from "./Layout.view";

export const Layout = () => <LayoutView {...useLayoutState()} />;
