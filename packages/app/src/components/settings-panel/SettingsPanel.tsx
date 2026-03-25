import { Snappy, type SnappyOptions } from "@snappy/domain";

import { t } from "../../core";
import styles from "./SettingsPanel.module.scss";
import { SettingsPanelRow } from "./SettingsPanelRow";
import { SettingsPanelTabs } from "./SettingsPanelTabs";

export type SettingsPanelProps = { disabled?: boolean; onChange: (value: SnappyOptions) => void; value: SnappyOptions };

export const SettingsPanel = ({ disabled = false, onChange, value }: SettingsPanelProps) => {
  const change = <K extends keyof SnappyOptions>(key: K, next: SnappyOptions[K]) => onChange({ ...value, [key]: next });

  return (
    <div className={styles.root}>
      <SettingsPanelRow label={t(`options.formatLabel`)}>
        <SettingsPanelTabs
          disabled={disabled}
          isActive={key => value[key]}
          onChange={key => change(key, !value[key])}
          options={[
            { label: `😎 ${t(`options.addEmoji`)}`, title: t(`options.addEmoji`), value: `addEmoji` },
            { label: `📝 ${t(`options.addFormatting`)}`, title: t(`options.addFormatting`), value: `addFormatting` },
          ]}
          tabs={false}
          value="addEmoji"
        />
      </SettingsPanelRow>
      <SettingsPanelRow label={t(`options.length.label`)}>
        <SettingsPanelTabs
          disabled={disabled}
          onChange={next => change(`length`, next)}
          options={Snappy.lengths.map(key => ({
            label: `${Snappy.lengthEmojis[key]} ${t(`options.length.${key}`)}`,
            title: t(`options.length.${key}`),
            value: key,
          }))}
          value={value.length}
        />
      </SettingsPanelRow>
      <SettingsPanelRow label={t(`options.style.label`)}>
        <SettingsPanelTabs
          disabled={disabled}
          onChange={next => change(`style`, next)}
          options={Snappy.styles.map(key => ({
            label: `${Snappy.styleEmojis[key]} ${t(`options.style.${key}`)}`,
            title: t(`options.style.${key}`),
            value: key,
          }))}
          value={value.style}
        />
      </SettingsPanelRow>
    </div>
  );
};
