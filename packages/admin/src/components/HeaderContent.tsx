import { useHeaderContentState } from "./HeaderContent.state";
import { HeaderContentView } from "./HeaderContent.view";

export const HeaderContent = () => <HeaderContentView {...useHeaderContentState()} />;
