import { PasswordInput, SwitchDisplay } from "@snappy/ui";

import type { useSettingsAiTunnelState } from "./SettingsAiTunnel.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsCard, SettingsCardRow } from "./components";

export type SettingsAiTunnelViewProps = ReturnType<typeof useSettingsAiTunnelState>;

export const SettingsAiTunnelView = ({
  aiTunnelDirect,
  loading,
  onDirectSwitchClick,
  onTunnelKeyBlur,
  setTunnelKey,
  tunnelKey,
}: SettingsAiTunnelViewProps) => (
  <Page back title={t(`settings.aiTunnel.title`)}>
    <SettingsCard lead={t(`settings.aiTunnel.connectionLead`)} title={t(`settings.aiTunnel.connection`)}>
      <SettingsCardRow
        disabled={loading}
        icon="vpn_key"
        onClick={onDirectSwitchClick}
        right={<SwitchDisplay checked={aiTunnelDirect} disabled={loading} />}
        text={t(`settings.aiTunnel.directSwitch`)}
      />
    </SettingsCard>
    <SettingsCard lead={t(`settings.aiTunnel.keyLead`)} title={t(`settings.aiTunnel.keySection`)}>
      <PasswordInput
        disabled={loading || !aiTunnelDirect}
        label={t(`settings.aiTunnel.keyLabel`)}
        onBlur={onTunnelKeyBlur}
        onChange={setTunnelKey}
        value={tunnelKey}
      />
    </SettingsCard>
  </Page>
);
