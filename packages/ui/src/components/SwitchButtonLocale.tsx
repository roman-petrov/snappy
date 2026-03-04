import { useSwitchButtonLocaleState } from "./SwitchButtonLocale.state";
import { SwitchButtonLocaleView } from "./SwitchButtonLocale.view";

export const SwitchButtonLocale = () => <SwitchButtonLocaleView {...useSwitchButtonLocaleState()} />;
