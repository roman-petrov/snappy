import { useSettingsAiTunnelState } from "./SettingsAiTunnel.state";
import { SettingsAiTunnelView } from "./SettingsAiTunnel.view";

export const SettingsAiTunnel = () => <SettingsAiTunnelView {...useSettingsAiTunnelState()} />;
