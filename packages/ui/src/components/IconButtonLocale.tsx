import { useIconButtonLocaleState } from "./IconButtonLocale.state";
import { IconButtonLocaleView } from "./IconButtonLocale.view";

export const IconButtonLocale = () => <IconButtonLocaleView {...useIconButtonLocaleState()} />;
