import { useCookieBannerState } from "./CookieBanner.state";
import { CookieBannerView } from "./CookieBanner.view";

export const CookieBanner = () => <CookieBannerView {...useCookieBannerState()} />;
