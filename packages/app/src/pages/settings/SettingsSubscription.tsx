import { useSettingsSubscriptionState } from "./SettingsSubscription.state";
import { SettingsSubscriptionView } from "./SettingsSubscription.view";

export const SettingsSubscription = () => <SettingsSubscriptionView {...useSettingsSubscriptionState()} />;
