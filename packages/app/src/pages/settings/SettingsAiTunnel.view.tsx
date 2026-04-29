import { PasswordInput, SwitchDisplay } from "@snappy/ui";

import type { useSettingsAiTunnelState } from "./SettingsAiTunnel.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsCard, SettingsCardRow } from "./components";

export type SettingsAiTunnelViewProps = ReturnType<typeof useSettingsAiTunnelState>;

export const SettingsAiTunnelView = ({
  aiTunnelDirect,
  loading,
  onToggleDirect,
  persistKeyOnBlur,
  setTunnelKey,
  tunnelKey,
}: SettingsAiTunnelViewProps) => (
  <Page back title={t(`settingsAiTunnel.title`)}>
    <SettingsCard lead={t(`settingsAiTunnel.connectionLead`)} title={t(`settingsAiTunnel.connection`)}>
      <SettingsCardRow
        disabled={loading}
        end={<SwitchDisplay checked={aiTunnelDirect} disabled={loading} />}
        icon="🔐"
        onClick={() => {
          if (!loading) {
            void onToggleDirect(!aiTunnelDirect);
          }
        }}
        text={t(`settingsAiTunnel.directSwitch`)}
      />
    </SettingsCard>
    <SettingsCard lead={t(`settingsAiTunnel.keyLead`)} title={t(`settingsAiTunnel.keySection`)}>
      <PasswordInput
        disabled={loading || !aiTunnelDirect}
        label={t(`settingsAiTunnel.keyLabel`)}
        onBlur={() => void persistKeyOnBlur()}
        onChange={setTunnelKey}
        value={tunnelKey}
      />
    </SettingsCard>
  </Page>
);
