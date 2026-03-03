import { useSiteHeaderState } from "./SiteHeader.state";
import { SiteHeaderView } from "./SiteHeader.view";

export const SiteHeader = () => <SiteHeaderView {...useSiteHeaderState()} />;
