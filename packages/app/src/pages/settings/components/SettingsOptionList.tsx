import { SettingsCard } from "./SettingsCard";
import { SettingsCards } from "./SettingsCards";
import { SettingsOptionRows, type SettingsOptionRowsProps } from "./SettingsOptionRows";

export type SettingsOptionListProps<T extends string | undefined> = SettingsOptionRowsProps<T>;

export const SettingsOptionList = <T extends string | undefined>(props: SettingsOptionListProps<T>) => (
  <SettingsCards>
    <SettingsCard>
      <SettingsOptionRows {...props} />
    </SettingsCard>
  </SettingsCards>
);
