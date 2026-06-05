import { FilledIcon, Page, PasswordInput, SwitchDisplay } from "@snappy/ui";
import { KeyRound } from "lucide-react";

import type { useSettingsAiTunnelState } from "./SettingsAiTunnel.state";

import { t } from "../../core";
import { SettingsCard, SettingsCardRow } from "./components";

export type SettingsAiTunnelViewProps = ReturnType<typeof useSettingsAiTunnelState>;

export const SettingsAiTunnelView = ({
  aiTunnelDirect,
  loading,
  setTunnelKey,
  toggleDirect,
  tunnelKey,
  tunnelKeyBlur,
}: SettingsAiTunnelViewProps) => (
  <Page back title={t(`settings.aiTunnel.title`)}>
    <SettingsCard lead={t(`settings.aiTunnel.connectionLead`)} title={t(`settings.aiTunnel.connection`)}>
      <SettingsCardRow
        disabled={loading}
        icon={<FilledIcon color="accentPlum" icon={KeyRound} />}
        onClick={toggleDirect}
        right={<SwitchDisplay checked={aiTunnelDirect} disabled={loading} />}
        text={t(`settings.aiTunnel.directSwitch`)}
      />
    </SettingsCard>
    <SettingsCard lead={t(`settings.aiTunnel.keyLead`)} title={t(`settings.aiTunnel.keySection`)}>
      <PasswordInput
        disabled={loading || !aiTunnelDirect}
        label={t(`settings.aiTunnel.keyLabel`)}
        onBlur={tunnelKeyBlur}
        onChange={setTunnelKey}
        value={tunnelKey}
      />
    </SettingsCard>
  </Page>
);
